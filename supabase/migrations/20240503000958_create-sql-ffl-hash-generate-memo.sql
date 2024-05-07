-- Enable the "pgcrypto" extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


DROP DOMAIN IF EXISTS uint2 CASCADE;
CREATE DOMAIN uint2 AS int4 CHECK(VALUE >= 0 AND VALUE < 65536);
DROP DOMAIN IF EXISTS uint4 CASCADE;
CREATE DOMAIN uint4 AS int8 CHECK(VALUE >= 0 AND VALUE < 4294967296);


DROP TYPE IF EXISTS ff1_round_state CASCADE;
CREATE TYPE ff1_round_state AS (
    PQ bytea,
    radix uint2,
    u integer,
    v integer,
    b integer,
    d integer,
    key bytea
);


CREATE OR REPLACE FUNCTION NUM_radix(radix uint2, data integer[]) 
RETURNS numeric AS $$
DECLARE
    acc numeric = 0;
    val integer;
BEGIN
    -- Loop through each element in the data array
    FOREACH val IN ARRAY data LOOP
        acc = acc * radix + val;  -- Perform the arithmetic in the specified radix
    END LOOP;
    RETURN acc;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION numeric_to_bytes_BE(value numeric, len integer) 
RETURNS bytea AS $$
    SELECT decode(repeat('00', len - b.length ), 'hex') || b FROM to_bytea(value) b;
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION bytes_to_numeric_BE(bytes bytea)
RETURNS numeric AS $$
    SELECT to_numeric(bytes, 256);
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION ff1_get_round(x integer[], radix uint2, key bytea, tweak bytea DEFAULT '')
RETURNS ff1_round_state AS $$
DECLARE
    n integer = array_length(x, 1);
    t integer = length(tweak);
    min_len uint4;
    max_len uint4;
    u integer;
    v integer;
    b integer;
    d integer;
    padding integer;
    round ff1_round_state;
BEGIN
    -- The minimum domain size for FF1 in Draft SP 800-38G Revision 1 is one million
    -- radix^minlen ≥ 1000000
    min_len = ceil(ln(1000000) / ln(radix)::numeric);
    max_len = 2 ^ 32 - 1;
    -- 2 ≤ minlen ≤ maxlen < 2^32
    IF 2 > min_len OR min_len > max_len OR max_len >= 2 ^ 32 THEN
      RAISE 'Invalid radix: 2 ≤ minLen ≤ maxLen < 2^32' USING ERRCODE = 'invalid_radix';
    END IF;
    IF n < min_len OR n > max_len THEN
      RAISE 'xLen is outside minLen..maxLen bounds' USING ERRCODE = 'outside_bounds';
    END IF;
    -- let u = floor(n / 2).
    u = trunc(n / 2);
    -- let v = n – u.
    v = n - u;
    -- let b = ceil( ceil(v * LOG(radix)) / 8).
    b = ceil(ceil(v * log(2, radix)) / 8::numeric);
    -- let d = 4 * [b/4] + 4.
    d = 4 * ceil(b / 4::numeric) + 4;
    -- let P = [1]1 || [2]1 || [1]1 || [radix]3 || [10]1 || [u mod 256]1 || [n]4 || [t]4.
    -- let Q = T || [0](−t−b−1) mod 16 || [i]1 || [NUMradix(B)]b.
    -- let PQ = P || Q.
    padding = real_mod(-t - b - 1, 16);
    round.PQ = '\x01020100'::bytea || int2send(radix::int2) || '\x0aff'::bytea || int4send(n) || int4send(t) || tweak || decode(repeat('00', padding + 1 + b), 'hex');
    round.PQ = set_byte(round.PQ, 7, u);
    -- Return round vectors
    round.radix = radix;
    round.u = u;
    round.v = v;
    round.b = b;
    round.d = d;
    round.key = key;
    RETURN round;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION ff1_do_round(
    INOUT round ff1_round_state, 
    INOUT A integer[], 
    INOUT B integer[], 
    i integer, 
    decrypt boolean DEFAULT false)
RETURNS RECORD AS $$
DECLARE
    BLOCK_LEN integer = 16;
    PQ bytea = round.PQ;
    radix uint2 = round.radix;
    R bytea;
    S bytea;
BEGIN
    -- let Q = ... || [i]1 || [NUMradix(B)]b.
    PQ = set_byte(PQ, length(PQ) - round.b - 1, i);
    IF round.b != 0 THEN
        PQ = overlay(PQ PLACING numeric_to_bytes_be(NUM_radix(radix, B), round.b) from (length(PQ) - round.b + 1));
    END IF;
    round.PQ = PQ;

    -- let R = PRF(P || Q).
    R = encrypt(PQ, round.key, 'aes-cbc/pad:none');
    R = substring(r FROM length(R) - BLOCK_LEN + 1 for BLOCK_LEN);

    -- let S be the first d bytes of the following string of ⎡d/16⎤ blocks:
    -- R || CIPHK(R ⊕[1]16) || CIPHK(R ⊕[2]16) ...CIPHK(R ⊕[⎡d / 16⎤ – 1]16).
    -- SELECT R || string_agg(encrypt(xor_bits(numeric_to_bytes_BE(j, 16), R), round.key, 'aes-ecb/pad:none'), null::bytea) INTO STRICT S FROM generate_series(0, ceil(round.d / 16::numeric) - 1) AS j;
    -- Optimized for speed:
    S := R; -- Start `S` with a copy of `R`
    DECLARE
        j integer = 1; -- Start loop with `j` counter as the number 1
        d integer = round.d;
        block bytea;
    BEGIN
        WHILE length(S) < d LOOP
            block = numeric_to_bytes_BE(j::numeric, 16); -- Convert counter to 16-byte, big-endian format
            -- XOR each byte of the block with `R`
            FOR k IN 0..(BLOCK_LEN - 1) LOOP
                block = set_byte(block, k, get_byte(block, k) # get_byte(R, k));
            END LOOP;
            S = S || encrypt(block, round.key, 'aes-ecb/pad:none'); -- Encrypt the block and append to `S`
            j = j + 1;  -- Increment the counter
        END LOOP;
    END;

    DECLARE
        y numeric;
        c numeric;
        m integer;
    BEGIN
        -- Convert the first d bytes of `S` to a numeric (big-endian)
        -- let y = NUM(S).
        y = bytes_to_numeric_BE(substring(S FROM 1 FOR round.d));

        -- Reset S to zero
        S = zero_bits(S);

        -- If decrypt is true, negate y
        IF decrypt THEN
            y = -y;
        END IF;

        -- if i is even, let m = u; else, let m = v.
        m = CASE WHEN i % 2 = 0 THEN round.u ELSE round.v END;

        -- let c = (NUMradix (A) + y) mod radix^m
        c = real_mod(NUM_radix(radix, A) + y, radix::numeric ^ m::numeric);

        -- Reset A to zero
        FOR i IN array_lower(A, 1)..array_upper(A, 1) LOOP
            A[i] := 0;  -- Zero each element
        END LOOP;

        -- let A = B.
        A = B;

        -- let B = C = STR(radix, m, c)
        B = array_fill(0::integer, ARRAY[m]);
        FOR i IN REVERSE m..1 LOOP
            B[i] := (c % radix)::integer;
            c = trunc(c / radix);
        END LOOP;
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION ff1_encrypt(
    x integer[],
    radix integer,
    key bytea,
    tweak bytea DEFAULT '')
RETURNS integer[] AS $$
DECLARE
    round ff1_round_state = ff1_get_round(x, radix, key, tweak);
    A integer[] = x[1:round.u];
    B integer[] = x[round.u+1:];
BEGIN
    -- Loop to perform 10 rounds of the FF1 algorithm
    FOR i IN 0..9 LOOP
        SELECT out.A, out.B INTO STRICT A, B FROM ff1_do_round(round, A, B, i, false) AS out;
    END LOOP;

    RETURN A || B; -- Return the concatenated result of A and B
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION ff1_decrypt(
    x integer[], 
    radix integer, 
    key bytea, 
    tweak bytea DEFAULT '')
RETURNS integer[] AS $$
DECLARE
    -- The FF1.Decrypt algorithm is similar to the FF1.Encrypt algorithm;
    round ff1_round_state = ff1_get_round(x, radix, key, tweak);
    A integer[] = x[round.u+1:];
    B integer[] = x[1:round.u];
BEGIN
    -- Loop to perform 10 rounds of the FF1 algorithm
    FOR i IN REVERSE 9..0 LOOP
        SELECT out.A, out.B INTO STRICT A, B FROM ff1_do_round(round, A, B, i, true) AS out;
    END LOOP;

    RETURN B || A; -- Return the concatenated result of B and A
END;
$$ LANGUAGE plpgsql IMMUTABLE STRICT PARALLEL SAFE;

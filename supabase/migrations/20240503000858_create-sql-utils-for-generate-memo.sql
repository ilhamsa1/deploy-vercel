CREATE OR REPLACE FUNCTION real_mod(a anycompatiblenonarray, b anycompatiblenonarray)
RETURNS anycompatiblenonarray AS $$
    SELECT mod(b + mod(a, b), b);
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION to_bytea(value anycompatiblenonarray) 
RETURNS bytea AS $$
    WITH RECURSIVE builder AS (
        SELECT 
            0 AS iteration,
            value AS current_val,
            (value % 256)::integer AS byte_val,
            (CASE WHEN value = 0 THEN '\x00'::bytea ELSE null::bytea END) AS byte_acc
        UNION ALL
        SELECT 
            iteration + 1 AS iteration,
            ((current_val - byte_val) / 256) AS current_val,
            (((current_val - byte_val) / 256) % 256)::integer AS byte_val,
            set_byte('\x00'::bytea, 0, byte_val) AS byte_acc
        FROM builder
        WHERE current_val > 0
    )
    SELECT string_agg(byte_acc, null::bytea ORDER BY iteration DESC) FROM builder;
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION to_numeric(data bytea, radix integer DEFAULT 256) 
RETURNS numeric AS $$
    WITH RECURSIVE builder AS (
        SELECT 
            0::numeric AS acc, -- Start with zero, using numeric for arbitrary precision
            0 AS idx  -- Start index for the data byte-array
        UNION ALL
        SELECT 
            acc * radix + get_byte(data, idx) AS acc,  -- Perform the arithmetic
            idx + 1 AS idx -- Increment the index for the input byte-array
        FROM builder
        WHERE idx <= data.length
    )
    SELECT acc FROM builder LIMIT 1 OFFSET data.length;
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;


CREATE OR REPLACE FUNCTION zero_bits(bytes bytea)
RETURNS bytea AS $$
    SELECT decode(repeat('00', bytes.length), 'hex');
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;
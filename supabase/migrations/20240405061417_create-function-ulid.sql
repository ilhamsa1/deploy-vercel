-- create a function when uuid generate ulid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to generate new v7 UUIDs.
-- In the future we might want use an extension: https://github.com/fboulnois/pg_uuidv7
-- Or, once the UUIDv7 spec is finalized, it will probably make it into the 'uuid-ossp' extension
-- and a custom function will no longer be necessary.
create or replace function uuid_generate_v7()
returns uuid
as $$
declare
  unix_ts_ms bytea;
  uuid_bytes bytea;
begin
  unix_ts_ms = substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3);
  uuid_bytes = uuid_send(gen_random_uuid());
  uuid_bytes = overlay(uuid_bytes placing unix_ts_ms from 1 for 6);
  uuid_bytes = set_byte(uuid_bytes, 6, (b'0111' || get_byte(uuid_bytes, 6)::bit(4))::bit(8)::int);
  return encode(uuid_bytes, 'hex')::uuid;
end
$$
language plpgsql
volatile;

-- create a function to return uuid to ulid
CREATE OR REPLACE FUNCTION uuid_to_ulid(id uuid) RETURNS text AS $$
DECLARE
  encoding   bytea = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  output     text  = '';
  uuid_bytes bytea = uuid_send(id);
BEGIN

  -- Encode the timestamp
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 0) & 224) >> 5));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 0) & 31)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 1) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 1) & 7) << 2) | ((GET_BYTE(uuid_bytes, 2) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 2) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 2) & 1) << 4) | ((GET_BYTE(uuid_bytes, 3) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 3) & 15) << 1) | ((GET_BYTE(uuid_bytes, 4) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 4) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 4) & 3) << 3) | ((GET_BYTE(uuid_bytes, 5) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 5) & 31)));

  -- Encode the entropy
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 6) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 6) & 7) << 2) | ((GET_BYTE(uuid_bytes, 7) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 7) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 7) & 1) << 4) | ((GET_BYTE(uuid_bytes, 8) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 8) & 15) << 1) | ((GET_BYTE(uuid_bytes, 9) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 9) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 9) & 3) << 3) | ((GET_BYTE(uuid_bytes, 10) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 10) & 31)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 11) & 248) >> 3));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 11) & 7) << 2) | ((GET_BYTE(uuid_bytes, 12) & 192) >> 6)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 12) & 62) >> 1));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 12) & 1) << 4) | ((GET_BYTE(uuid_bytes, 13) & 240) >> 4)));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 13) & 15) << 1) | ((GET_BYTE(uuid_bytes, 14) & 128) >> 7)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 14) & 124) >> 2));
  output = output || CHR(GET_BYTE(encoding, ((GET_BYTE(uuid_bytes, 14) & 3) << 3) | ((GET_BYTE(uuid_bytes, 15) & 224) >> 5)));
  output = output || CHR(GET_BYTE(encoding, (GET_BYTE(uuid_bytes, 15) & 31)));

  RETURN output;
END
$$
LANGUAGE plpgsql
IMMUTABLE;

-- create a function to parsing uuid to ulid
CREATE OR REPLACE FUNCTION parse_ulid(ulid text) RETURNS bytea AS $$
DECLARE
  -- 16byte
  bytes bytea = E'\\x00000000 00000000 00000000 00000000';
  v     char[];
  -- Allow for O(1) lookup of index values
  dec   integer[] = ARRAY[
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
    255, 255, 255, 255, 255, 255, 255,   0,   1,   2,
      3,   4,   5,   6,   7,   8,   9, 255, 255, 255,
    255, 255, 255, 255,  10,  11,  12,  13,  14,  15,
     16,  17,   1,  18,  19,   1,  20,  21,   0,  22,
     23,  24,  25,  26, 255,  27,  28,  29,  30,  31,
    255, 255, 255, 255, 255, 255,  10,  11,  12,  13,
     14,  15,  16,  17,   1,  18,  19,   1,  20,  21,
      0,  22,  23,  24,  25,  26, 255,  27,  28,  29,
     30,  31
  ];
BEGIN
  IF NOT ulid ~* '^[0-7][0-9ABCDEFGHJKMNPQRSTVWXYZ]{25}$' THEN
    RAISE EXCEPTION 'Invalid ULID: %', ulid;
  END IF;

  v = regexp_split_to_array(ulid, '');

  -- 6 bytes timestamp (48 bits)
  bytes = SET_BYTE(bytes, 0, (dec[ASCII(v[1])] << 5) | dec[ASCII(v[2])]);
  bytes = SET_BYTE(bytes, 1, (dec[ASCII(v[3])] << 3) | (dec[ASCII(v[4])] >> 2));
  bytes = SET_BYTE(bytes, 2, (dec[ASCII(v[4])] << 6) | (dec[ASCII(v[5])] << 1) | (dec[ASCII(v[6])] >> 4));
  bytes = SET_BYTE(bytes, 3, (dec[ASCII(v[6])] << 4) | (dec[ASCII(v[7])] >> 1));
  bytes = SET_BYTE(bytes, 4, (dec[ASCII(v[7])] << 7) | (dec[ASCII(v[8])] << 2) | (dec[ASCII(v[9])] >> 3));
  bytes = SET_BYTE(bytes, 5, (dec[ASCII(v[9])] << 5) | dec[ASCII(v[10])]);

  -- 10 bytes of entropy (80 bits);
  bytes = SET_BYTE(bytes, 6, (dec[ASCII(v[11])] << 3) | (dec[ASCII(v[12])] >> 2));
  bytes = SET_BYTE(bytes, 7, (dec[ASCII(v[12])] << 6) | (dec[ASCII(v[13])] << 1) | (dec[ASCII(v[14])] >> 4));
  bytes = SET_BYTE(bytes, 8, (dec[ASCII(v[14])] << 4) | (dec[ASCII(v[15])] >> 1));
  bytes = SET_BYTE(bytes, 9, (dec[ASCII(v[15])] << 7) | (dec[ASCII(v[16])] << 2) | (dec[ASCII(v[17])] >> 3));
  bytes = SET_BYTE(bytes, 10, (dec[ASCII(v[17])] << 5) | dec[ASCII(v[18])]);
  bytes = SET_BYTE(bytes, 11, (dec[ASCII(v[19])] << 3) | (dec[ASCII(v[20])] >> 2));
  bytes = SET_BYTE(bytes, 12, (dec[ASCII(v[20])] << 6) | (dec[ASCII(v[21])] << 1) | (dec[ASCII(v[22])] >> 4));
  bytes = SET_BYTE(bytes, 13, (dec[ASCII(v[22])] << 4) | (dec[ASCII(v[23])] >> 1));
  bytes = SET_BYTE(bytes, 14, (dec[ASCII(v[23])] << 7) | (dec[ASCII(v[24])] << 2) | (dec[ASCII(v[25])] >> 3));
  bytes = SET_BYTE(bytes, 15, (dec[ASCII(v[25])] << 5) | dec[ASCII(v[26])]);

  RETURN bytes;
END
$$
LANGUAGE plpgsql
IMMUTABLE;

-- create a function to reverse ulid to uuid
CREATE OR REPLACE FUNCTION ulid_to_uuid(ulid text) RETURNS uuid AS $$
BEGIN
  RETURN encode(parse_ulid(ulid), 'hex')::uuid;
END
$$
LANGUAGE plpgsql
IMMUTABLE;

-- create domain uuid_ulid to: serve uuid type data as ulid, and stored ulid data back to uuid
CREATE DOMAIN UUID_ULID AS UUID;

-- create a function to convert uuid_ulid to json
CREATE OR REPLACE FUNCTION json(UUID_ULID)
RETURNS JSON
AS
$$
  select to_json(uuid_to_ulid($1));
$$
LANGUAGE SQL
IMMUTABLE;

-- create a function to convert back text ulid to uuid
CREATE OR REPLACE FUNCTION uuid_ulid(TEXT)
RETURNS UUID_ULID
AS
$$
  SELECT ulid_to_uuid($1);
$$
LANGUAGE sql
IMMUTABLE;

-- create a function to convert back json ulid to uuid
CREATE OR REPLACE FUNCTION uuid_ulid(JSON)
RETURNS UUID_ULID
AS
$$
  select ulid_to_uuid($1 #>> '{}');
$$
LANGUAGE sql
IMMUTABLE;

-- create cast to convert uuid_ulid as json
CREATE CAST (UUID_ULID AS JSON)
WITH FUNCTION json(UUID_ULID)
AS IMPLICIT;

-- create cast to convert text as uuid_ulid
CREATE CAST (TEXT AS UUID_ULID)
WITH FUNCTION uuid_ulid(TEXT)
AS IMPLICIT;

-- create cast to convert json to uuid_ulid
CREATE CAST (JSON AS uuid_ulid)
WITH FUNCTION uuid_ulid(JSON)
AS IMPLICIT;

-- create a function for uuid_ulid eq operator
CREATE OR REPLACE FUNCTION uuid_ulid_eq_operator(lhs_id UUID_ULID, rhs_id TEXT)
RETURNS BOOLEAN
AS
$$
  SELECT uuid_send(lhs_id) = parse_ulid(rhs_id);
$$
LANGUAGE sql
IMMUTABLE;

-- create operator ===
CREATE OPERATOR === (
  LEFTARG = UUID_ULID,
  RIGHTARG = TEXT,
  FUNCTION = uuid_ulid_eq_operator,
  COMMUTATOR = ===,
  NEGATOR = !==,
  HASHES,
  MERGES
);
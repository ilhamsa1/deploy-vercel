-- Enable the "pgsodium" extension
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- Use a server-managed secret key (with key-rotation)
CREATE OR REPLACE FUNCTION gen_mask_secret(char(8), int8 DEFAULT 1, integer DEFAULT 16)
RETURNS bytea 
AS $$
  -- gen_mask_secret(key_realm, rotate_idx, key_length)
  -- key_length: `32` for 256-bit key
  SELECT pgsodium.derive_key($2, $3, $1::bytea);
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
SECURITY DEFINER SET search_path = 'extensions', 'public';

CREATE OR REPLACE FUNCTION public.gen_memo_code(numeric, integer DEFAULT 6, varchar(512) DEFAULT '')
RETURNS text AS $$
  -- gen_mask_code(id, min_char_length, tweak_or_seed)
  WITH t1(num_text) AS (
    VALUES (trunc($1)::text)
  ), t2(num_text) AS (
    SELECT (CASE WHEN length(num_text) < $2 THEN lpad(num_text, $2, '0') ELSE num_text END) FROM t1
  )
  SELECT array_to_string(ff1_encrypt(regexp_split_to_array(num_text, '')::integer[], 10, gen_mask_secret('_memo___'), $3::bytea), '') FROM t2 LIMIT 1;
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
SECURITY DEFINER SET search_path = 'extensions', 'public';

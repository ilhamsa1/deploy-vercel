-- Enable the "pgsodium" extension
CREATE EXTENSION IF NOT EXISTS pgsodium;

-- Enable the "pgcrypto" extension
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Enable the "pg_hashids" extension
CREATE EXTENSION IF NOT EXISTS pg_hashids WITH SCHEMA extensions;

-- Create the gen_short_secret(key_realm, key_rotate_idx, key_length) function
CREATE OR REPLACE FUNCTION gen_short_secret(char(8), int8 DEFAULT 1, integer DEFAULT 56)
RETURNS bytea AS $$
  -- Use a server-managed secret key (with optional key-rotation)
  SELECT pgsodium.derive_key($2, $3, $1::bytea);
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;

-- Create the gen_short_code(id, secret, min_char_length, custom_alphabet_set) function
CREATE OR REPLACE FUNCTION gen_short_code(int8, bytea, integer DEFAULT 6, varchar(512) DEFAULT 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789')
RETURNS text AS $$
  SELECT id_encode(('x' || encode(encrypt(int8send($1), $2, 'bf-ecb/pad:none'), 'hex'))::bit(64)::int8, '', $3, $4);
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE;

-- create a public.org_invite table for storing invitation to join org
CREATE TABLE public.org_invite (
  id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  created_by UUID NOT NULL,
  code TEXT UNIQUE GENERATED ALWAYS AS (gen_short_code(id, gen_short_secret('_invite_'))) STORED,
  send_to TEXT,
  role TEXT,
  accepted_at TIMESTAMPTZ,
  PRIMARY KEY(id),
  CONSTRAINT fk_inviter_user FOREIGN KEY (created_by, org_id) REFERENCES user_orgs (user_id, org_id) ON DELETE CASCADE
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_invite ENABLE ROW LEVEL SECURITY;
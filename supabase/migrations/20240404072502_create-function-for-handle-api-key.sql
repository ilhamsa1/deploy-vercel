-- Table to store JWTs (JSON Web Tokens) associated with users for authentication purposes.
-- Table for storing the relationship between user.id and password/secret.id
CREATE TABLE auth.jwts (
  secret_id UUID NOT NULL,                            -- UUID for the JWT secret
  user_id UUID NULL,                                  -- UUID for the user (nullable)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT jwts_pkey PRIMARY KEY (secret_id),       -- Primary key constraint
  CONSTRAINT jwts_secret_id_fkey FOREIGN KEY (secret_id) REFERENCES vault.secrets (id) ON DELETE CASCADE,    -- Foreign key constraint referencing vault.secrets
  CONSTRAINT user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE                  -- Foreign key constraint referencing auth.users
) tablespace pg_default;

-- Insert initial secrets for project API key and JWT secret into the vault.
INSERT INTO vault.secrets (name, secret) VALUES (
  'project_api_key_secret',                             -- Name of the secret for project API key
  encode(digest(gen_random_bytes(32), 'sha512'), 'hex') -- Generate and encode the secret for project API key
), (
  'project_jwt_secret',                                 -- Name of the secret for project JWT
  'your-project-jwt-secret-here'                        -- JWT secret value
);

-- Function to create a vault secret for a newly created user.
CREATE OR REPLACE FUNCTION create_user_vault_secret()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = extensions
AS $$
DECLARE
  rand_bytes BYTEA := gen_random_bytes(32);                               -- Generate random bytes
  user_secret TEXT := encode(digest(rand_bytes, 'sha512'), 'hex');        -- Generate and encode the user secret
BEGIN
  INSERT INTO vault.secrets (name, secret) VALUES (new.id, user_secret);  -- Insert the user secret into the vault
  RETURN new;
END;
$$;

-- Trigger to execute create_user_vault_secret function after a new user is inserted into auth.users table.
CREATE TRIGGER on_user_created__create_user_vault_secret AFTER INSERT
  ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_vault_secret();

-- Function to remove user vault secrets when a user is deleted.
CREATE OR REPLACE FUNCTION remove_user_vault_secrets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
DECLARE
  jwt_record record;                                          -- Record for iterating over JWTs associated with the user
BEGIN
  DELETE FROM vault.secrets WHERE name=old.id::text;          -- Delete user vault secrets
  FOR jwt_record IN (
    SELECT secret_id
    FROM auth.jwts
    WHERE user_id=old.id
  ) LOOP
    DELETE FROM vault.secrets WHERE id=jwt_record.secret_id;  -- Delete JWT-related secrets
  END LOOP;
  RETURN old;
END;
$$;

-- Trigger to execute remove_user_vault_secrets function after a user is deleted from auth.users table.
CREATE TRIGGER on_user_deleted__remove_user_vault_secrets AFTER DELETE
  ON auth.users FOR EACH ROW EXECUTE FUNCTION remove_user_vault_secrets();

-- This function creates an API key for a given user and stores it securely in the database.
CREATE OR REPLACE FUNCTION create_api_key(id_of_user UUID, key_description TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY definer
SET search_path = extensions
AS $$
DECLARE
  api_key TEXT;                    -- Variable to store the generated API key
  jti uuid = gen_random_uuid();    -- Unique identifier for the JWT
  jwt TEXT;                        -- JSON Web Token
  jwt_body JSONB;                  -- JSON payload of the JWT
  jwt_vault_name TEXT;             -- Name of the jwt in vault
  jwt_record_id UUID;              -- UUID for the stored JWT
  user_secret TEXT;                -- Secret key for user
  project_jwt_secret TEXT;         -- Secret key for JWT generation
  project_api_key_secret TEXT;     -- Secret key for API key generation
  time_stamp BIGINT = trunc(extract(epoch FROM NOW()), 0);                            -- Unix timestamp for current time
  expires BIGINT = time_stamp + trunc(extract(epoch FROM interval '100 years'), 0);   -- Unix timestamp for expiration time (100 years from now)
BEGIN
  -- Check if the authenticated user matches the provided user ID
  IF auth.uid() = id_of_user THEN
    -- Build the JWT payload
    jwt_body := jsonb_build_object(
      'role', 'authenticated',
      'aud', 'authenticated',
      'iss', 'supabase',
      'sub', to_jsonb(id_of_user::text),
      'iat', to_jsonb(time_stamp),
      'exp', to_jsonb(expires),
      'jti', to_jsonb(jti));

    -- Retrieve necessary secrets from the vault
    SELECT decrypted_secret INTO user_secret FROM vault.decrypted_secrets WHERE name=id_of_user::text;
    SELECT decrypted_secret INTO project_api_key_secret FROM vault.decrypted_secrets WHERE name='project_api_key_secret';
    SELECT decrypted_secret INTO project_jwt_secret FROM vault.decrypted_secrets WHERE name='project_jwt_secret';

    -- Sign the JWT
    jwt = sign(jwt_body::json, project_jwt_secret);

    -- Generate the API key using the JWT and user's secret key
    api_key := encode(hmac(jwt, user_secret, 'sha512'), 'hex');

    -- Generate the hash of the project
    jwt_vault_name := encode(hmac(api_key, project_api_key_secret, 'sha512'), 'hex');

    -- Insert the API key and JWT into the vault
    INSERT INTO vault.secrets (name, secret, description)
      VALUES (jwt_vault_name, jwt, key_description)
      RETURNING id INTO jwt_record_id;

    -- Associate the JWT with the user in the authentication table
    INSERT INTO auth.jwts (secret_id, user_id) VALUES (jwt_record_id, id_of_user);

    RETURN jwt_record_id;
  END IF;

  RETURN NULL;
END;
$$;

-- This function retrieves the API keys associated with a given user from the database.
CREATE OR REPLACE FUNCTION list_api_keys(id_of_user UUID)
RETURNS TABLE (id TEXT, description TEXT, created_at TIMESTAMPTZ)
LANGUAGE sql
SECURITY definer
SET search_path = extensions
AS $$
  SELECT j.secret_id, s.description, j.created_at
    FROM auth.jwts j
    LEFT JOIN vault.decrypted_secrets s ON s.id = j.secret_id
    WHERE auth.uid() = id_of_user AND user_id = id_of_user;
$$;

-- This function retrieves the API key associated with a specific secret ID for a given user from the database.
CREATE OR REPLACE FUNCTION get_api_key(id_of_user UUID, secret_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY definer
SET search_path = extensions
AS $$
DECLARE
  jwt TEXT;                     -- Variable to hold the decrypted JWT
  key TEXT;                     -- Variable to hold the generated API key
  user_api_key_secret TEXT;     -- Secret key for decrypting user's API key
BEGIN
  -- Check if the authenticated user matches the provided user ID
  IF auth.uid() = id_of_user THEN
    -- Retrieve the user's API key secret from the vault
    SELECT decrypted_secret INTO user_api_key_secret FROM vault.decrypted_secrets WHERE name=id_of_user::text;

    -- Retrieve the decrypted JWT using the provided secret ID
    SELECT decrypted_secret INTO jwt FROM vault.decrypted_secrets WHERE id=secret_id;

    -- Generate the API key using the JWT and user's secret key
    key := encode(hmac(jwt, user_api_key_secret, 'sha512'), 'hex');
  END IF;

  -- Return the generated API key
  RETURN key;
END;
$$;

-- This function revokes (deletes) an API key associated with a specific secret ID for a given user from the database.
-- Password/secret record will be deleted from vault table
CREATE OR REPLACE FUNCTION revoke_api_key(id_of_user UUID, key_secret_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  -- Check if the authenticated user matches the provided user ID
  IF auth.uid() = id_of_user THEN
    UPDATE auth.jwts SET deleted_at = NOW() WHERE secret_id=key_secret_id;
    -- Delete the API key from the vault using the provided secret ID
    DELETE FROM vault.secrets WHERE id=key_secret_id;
  END IF;
END;
$$;

-- This function retrieves the user ID associated with the provided API key from the database.
CREATE OR REPLACE FUNCTION auth.key_uid()
RETURNS UUID
LANGUAGE plpgsql
SECURITY definer
SET search_path = extensions
AS $$
DECLARE
  user_api_key_hash TEXT;               -- Hash of the project
  project_api_key_secret TEXT;     -- Secret key for API key generation
  secret_uuid UUID;                -- UUID for the stored secret
  user_api_key TEXT;               -- API key provided by the user
BEGIN
  -- Retrieve the API key from the request headers
  SELECT current_setting('request.headers', true)::json->>'authorization' INTO user_api_key;

  -- Retrieve the secret key for the project's API key generation
  SELECT decrypted_secret INTO project_api_key_secret FROM vault.decrypted_secrets WHERE name='project_api_key_secret';

  -- Generate the hash of the provided API key
  user_api_key_hash := encode(hmac(user_api_key, project_api_key_secret, 'sha512'), 'hex');

  -- Retrieve the UUID of the secret associated with the user_api_key_hash
  SELECT id INTO secret_uuid FROM vault.secrets WHERE name=user_api_key_hash;

  -- If a secret UUID is found, return the user ID associated with the secret
  IF secret_uuid IS NOT NULL THEN
    RETURN (SELECT user_id FROM auth.jwts WHERE secret_id=secret_uuid AND deleted_at IS NULL);
  ELSE
    -- If no secret UUID is found, return null
    RETURN NULL;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION auth.current_uid()
RETURNS uuid AS $$
  SELECT CASE WHEN (SELECT auth.role()) = 'anon' THEN (SELECT auth.key_uid()) ELSE (SELECT auth.uid()) END;
$$ LANGUAGE sql STABLE PARALLEL SAFE;

CREATE OR REPLACE FUNCTION auth.debug_role()
RETURNS TABLE (session_role text, user_role text, auth_role text)
ROWS 1
AS $$
  SELECT session_user, current_user, auth.role();
$$ LANGUAGE sql STABLE PARALLEL SAFE;

SELECT * FROM auth.debug_role();

-- All functions for RLS and cron must be placed in private schema or risk public exposure (via RPC API)
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.debug_role()
RETURNS TABLE (session_role text, user_role text, auth_role text)
ROWS 1
LANGUAGE sql
SECURITY DEFINER
SET search_path = private
STABLE PARALLEL SAFE
AS $$
  SELECT * FROM auth.debug_role();
$$;

SELECT * FROM private.debug_role();

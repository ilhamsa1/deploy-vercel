CREATE OR REPLACE FUNCTION private.select_org_id(acc_id BIGINT)
RETURNS BIGINT AS $$
DECLARE
  result BIGINT;
BEGIN
  SELECT org_id INTO result FROM public.business_account WHERE id = acc_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No matching record found for account_id: %', acc_id;
  END IF;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- Create the function to check that all elements in array is unique
CREATE OR REPLACE FUNCTION array_is_unique(arr anyarray) RETURNS boolean AS $$
  SELECT count(*) = count(DISTINCT unnest) FROM unnest(arr);
$$ LANGUAGE sql IMMUTABLE PARALLEL SAFE;

-- Create the array column type where all elements must be unique
CREATE DOMAIN event_type_array AS event_type[]
  DEFAULT ARRAY[]::event_type[]
  CHECK (array_is_unique(VALUE));

CREATE OR REPLACE FUNCTION generate_secret() RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(gen_random_bytes(32), 'sha512'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE TABLE public.webhook_endpoint (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  org_id BIGINT NOT NULL GENERATED ALWAYS AS (private.select_org_id(account_id)) STORED,
  account_id BIGINT NOT NULL REFERENCES public.business_account ON DELETE CASCADE,
  enabled_events event_type_array,
  status TEXT,
  url TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  secret TEXT DEFAULT generate_secret(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY(id)
);

-- enable RLS, we want to restrict access on this table
ALTER TABLE public.webhook_endpoint ENABLE ROW LEVEL SECURITY;

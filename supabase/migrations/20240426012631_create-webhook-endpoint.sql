CREATE OR REPLACE FUNCTION generate_secret() RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(gen_random_bytes(32), 'sha512'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- create a public.event table for storing event information
CREATE TABLE public.webhook_endpoint (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  org_id INTEGER REFERENCES org NOT NULL,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  enabled_events event_type[],
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

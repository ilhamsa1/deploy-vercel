-- create a public.event table for storing event information
CREATE TABLE public.event (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  request_id UUID REFERENCES request ON DELETE CASCADE,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  api_version TEXT,
  type TEXT,
  data JSONB,
  request JSONB,
  pending_webhooks INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;
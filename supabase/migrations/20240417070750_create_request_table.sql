-- create a public.request table for storing request information
CREATE TABLE public.request (
  id UUID NOT NULL DEFAULT uuid_generate_v7(),
  idempotency_key VARCHAR(255),
  livemode BOOLEAN,
  path TEXT,
  hash_body TEXT,
  received_at BIGINT,
  received_by TEXT,
  PRIMARY KEY(id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.request ENABLE ROW LEVEL SECURITY;
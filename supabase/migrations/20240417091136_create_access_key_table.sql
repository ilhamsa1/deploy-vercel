-- create a public.access_key table for storing access_key information
CREATE TABLE public.access_key (
  id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  account_id BIGINT REFERENCES business_account ON DELETE CASCADE,
  org_id INTEGER REFERENCES org ON DELETE CASCADE,
  public_id TEXT UNIQUE GENERATED ALWAYS AS (gen_short_code(id, gen_short_secret('__k_id__'))) STORED,
  secret TEXT UNIQUE GENERATED ALWAYS AS (gen_short_code(id, gen_short_secret('k_secret'))) STORED,
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY(id),
  CHECK (account_id IS NOT NULL OR org_id IS NOT NULL)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.access_key ENABLE ROW LEVEL SECURITY;
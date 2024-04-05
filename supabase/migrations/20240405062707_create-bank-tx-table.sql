-- create a public.bank_tx table for storing bank transaction information
CREATE TABLE public.bank_tx (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_ulid(),
  id2 CHAR(26) NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  ba_id INTEGER NOT NULL REFERENCES bank_account ON DELETE CASCADE,
  num BIGINT,
  ref_id TEXT,
  type CHAR,
  transacted_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  amount NUMERIC,
  amount_e INTEGER,
  currency TEXT,
  description TEXT,
  remarks TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank_tx ENABLE ROW LEVEL SECURITY;
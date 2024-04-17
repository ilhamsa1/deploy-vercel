-- create a public.payment_intent table for storing payment intent information
CREATE TABLE public.payment_intent (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  id2 CHAR(26) NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  amount NUMERIC,
  amount_e INTEGER,
  currency TEXT,
  description TEXT,
  customer TEXT,
  metadata JSONB,
  payment_method TEXT,
  next_action JSONB,
  receipt_email TEXT,
  status TEXT,
  confirmation_method TEXT,
  client_secret TEXT,
  last_payment_error JSONB,
  latest_charge UUID_ULID,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.payment_intent ENABLE ROW LEVEL SECURITY;
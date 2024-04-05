-- create a public.payment_tx table for storing payment transaction information
CREATE TABLE public.payment_tx (
  id UUID NOT NULL DEFAULT uuid_generate_ulid(),
  id2 TEXT NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  pi_id UUID NOT NULL REFERENCES payment_intent ON DELETE CASCADE,
  amount NUMERIC,
  amount_e INTEGER,
  currency TEXT,
  payment_method TEXT,
  payment_method_details JSONB,
  status TEXT,
  amount_refunded NUMERIC,
  refunds JSONB,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.payment_tx ENABLE ROW LEVEL SECURITY;
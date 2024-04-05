-- create a public.payment_intent table for storing payment intent information
CREATE TABLE public.payment_intent (
  id UUID NOT NULL DEFAULT uuid_generate_ulid(),
  id2 TEXT NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  user_id UUID NOT NULL,
  org_id INTEGER NOT NULL,
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
  latest_charge UUID,
  PRIMARY KEY (id),
  CONSTRAINT fk_user_org FOREIGN KEY (user_id, org_id) REFERENCES user_orgs(user_id, org_id) ON DELETE CASCADE
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.payment_intent ENABLE ROW LEVEL SECURITY;
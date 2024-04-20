-- create a public.payment_intent table for storing payment intent information
CREATE TABLE public.payment_intent (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  id2 CHAR(26) NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  org_id INTEGER REFERENCES org NOT NULL,
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

-- PAYMENT INTENT POLICY

CREATE POLICY "user can only view org payment intent data"
ON public.payment_intent
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only insert org payment intent data"
ON public.payment_intent
FOR INSERT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only update org payment intent data"
ON public.payment_intent
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

-- create a public.payment_tx table for storing payment transaction information
CREATE TABLE public.payment_tx (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  id2 CHAR(26) NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  pi_id UUID NOT NULL REFERENCES payment_intent ON DELETE CASCADE,
  org_id INTEGER REFERENCES org NOT NULL,
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

-- PAYMENT TX POLICY

CREATE POLICY "user can only view org payment tx data"
ON public.payment_tx
FOR SELECT
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

CREATE POLICY "user can only insert org payment tx data"
ON public.payment_tx
FOR INSERT
TO AUTHENTICATED
WITH CHECK ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

CREATE POLICY "user can only update org payment tx data"
ON public.payment_tx
FOR UPDATE
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

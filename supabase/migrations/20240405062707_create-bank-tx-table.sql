-- create a public.bank_tx table for storing bank transaction information
CREATE TABLE public.bank_tx (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  id2 CHAR(26) NOT NULL GENERATED ALWAYS AS (uuid_to_ulid(id)) STORED,
  ba_id INTEGER NOT NULL REFERENCES bank_account ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
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

-- BANK TX POLICY

CREATE POLICY "user can only view org bank tx data"
ON public.bank_tx
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only insert org bank tx data"
ON public.bank_tx
FOR INSERT
TO AUTHENTICATED
WITH CHECK (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only update org bank tx data"
ON public.bank_tx
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

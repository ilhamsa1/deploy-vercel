-- create a public.bank_account table for storing bank account information
CREATE TABLE public.bank_account (
  id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  bank_id INTEGER NOT NULL REFERENCES bank ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  num TEXT,
  name TEXT,
  last_allocated_at TIMESTAMPTZ,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank_account ENABLE ROW LEVEL SECURITY;

-- BANK ACCOUNT POLICY
-- user from same org can view org bank account data
CREATE POLICY "user can only view org bank account data"
ON public.bank_account
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );
-- only admin user from same org can add org bank account data
CREATE POLICY "user can only view org bank account data"
ON public.bank_account
FOR INSERT
TO AUTHENTICATED
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
-- only admin user from same org can update org bank account data
CREATE POLICY "user can only view org bank account data"
ON public.bank_account
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
-- only admin user from same org can delete org bank account data
CREATE POLICY "user can only view org bank account data"
ON public.bank_account
FOR DELETE
TO AUTHENTICATED
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
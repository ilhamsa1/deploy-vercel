-- create a public.bank table for storing bank information
CREATE TABLE public.bank (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  tag TEXT,
  name TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank ENABLE ROW LEVEL SECURITY;

-- BANK POLICY
-- user can view bank data
CREATE POLICY "user can only view all bank data"
ON public.bank
FOR SELECT
TO AUTHENTICATED
USING (true);

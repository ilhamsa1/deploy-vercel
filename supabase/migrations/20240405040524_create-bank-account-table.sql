-- create a public.bank_account table for storing bank account information
CREATE TABLE public.bank_account (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  bank_id INTEGER NOT NULL REFERENCES bank ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  num TEXT,
  name TEXT,
  last_allocated_at TIMESTAMPTZ,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank_account ENABLE ROW LEVEL SECURITY;
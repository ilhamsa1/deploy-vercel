-- create a public.bank table for storing bank information
CREATE TABLE public.bank (
  id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  tag TEXT,
  name TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank ENABLE ROW LEVEL SECURITY;
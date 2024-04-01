-- create public.org table for storing organization information
CREATE TABLE public.org (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  tier INTEGER NOT NULL REFERENCES usage_tier,
  tag TEXT,
  display_name TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org ENABLE ROW LEVEL SECURITY;
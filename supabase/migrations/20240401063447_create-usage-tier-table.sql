-- create public.usage_tier table for storing org tier
CREATE TABLE public.usage_tier (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  display_name TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.usage_tier ENABLE ROW LEVEL SECURITY;
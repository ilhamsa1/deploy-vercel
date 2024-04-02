-- create public.user_orgs table for storing user connected to organization
CREATE TABLE public.user_orgs (
  uid UUID NOT NULL REFERENCES "user" ON DELETE CASCADE,
  oid INTEGER NOT NULL REFERENCES org,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  PRIMARY KEY (uid)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.user_orgs ENABLE ROW LEVEL SECURITY;
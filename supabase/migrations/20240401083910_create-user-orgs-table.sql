-- create public.user_orgs table for storing user connected to organization
CREATE TABLE public.user_orgs (
  user_id UUID NOT NULL REFERENCES "user" ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT PK_user_org PRIMARY KEY(user_id, org_id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.user_orgs ENABLE ROW LEVEL SECURITY;

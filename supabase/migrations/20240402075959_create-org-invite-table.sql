-- create a public.org_invite table for storing invitation to join org
CREATE TABLE public.org_invite (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES "user" ON DELETE CASCADE,
  code TEXT,
  send_to TEXT,
  role TEXT,
  accepted_at TIMESTAMPTZ,
  PRIMARY KEY(id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_invite ENABLE ROW LEVEL SECURITY;
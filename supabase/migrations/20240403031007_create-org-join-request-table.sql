-- create a public.org_join_request table for storing request join org from user
CREATE TABLE public.org_join_request (
  id INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES "user" ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  approved_by UUID REFERENCES "user",
  note TEXT,
  PRIMARY KEY(id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_join_request ENABLE ROW LEVEL SECURITY;
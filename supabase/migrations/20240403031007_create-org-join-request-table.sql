-- crate a public.org_join_request table for storing request join org from user
CREATE TABLE public.org_join_request (
  user_id UUID NOT NULL REFERENCES user_orgs ON DELETE CASCADE,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  approved_by UUID NOT NULL REFERENCES user_orgs ON DELETE CASCADE,
  note TEXT
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_join_request ENABLE ROW LEVEL SECURITY;
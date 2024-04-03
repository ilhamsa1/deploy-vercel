-- create a public.org_join_request table for storing request join org from user
CREATE TABLE public.org_join_request (
  user_id UUID NOT NULL,
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  approved_by UUID,
  note TEXT,
  CONSTRAINT fk_request_user FOREIGN KEY (user_id, org_id) REFERENCES user_orgs (user_id, org_id) ON DELETE CASCADE,
  CONSTRAINT fk_approved_by_user FOREIGN KEY (approved_by, org_id) REFERENCES user_orgs (user_id, org_id) ON DELETE CASCADE
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_join_request ENABLE ROW LEVEL SECURITY;
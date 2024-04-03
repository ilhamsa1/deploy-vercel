-- create a public.org_invite table for storing invitation to join org
CREATE TABLE public.org_invite (
  org_id INTEGER NOT NULL REFERENCES org ON DELETE CASCADE,
  created_by UUID NOT NULL,
  code TEXT,
  send_to TEXT,
  role TEXT,
  accepted_at TIMESTAMPTZ,
  CONSTRAINT fk_inviter_user FOREIGN KEY (created_by, org_id) REFERENCES user_orgs (user_id, org_id) ON DELETE CASCADE
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.org_invite ENABLE ROW LEVEL SECURITY;
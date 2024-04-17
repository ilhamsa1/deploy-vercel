-- create public.user_orgs table for storing user connected to organization
CREATE TABLE public.business_account (
  id BIGINT NOT NULL GENERATED ALWAYS AS IDENTITY,
  public_id TEXT UNIQUE GENERATED ALWAYS AS (gen_short_code(id, gen_short_secret('_account'))) STORED,
  user_id UUID NOT NULL,
  org_id INTEGER REFERENCES org NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_user_org FOREIGN KEY (user_id, org_id) REFERENCES user_orgs(user_id, org_id) ON DELETE CASCADE
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.business_account ENABLE ROW LEVEL SECURITY;

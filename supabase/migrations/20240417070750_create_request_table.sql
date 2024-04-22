-- create a public.request table for storing request information
CREATE TABLE public.request (
  id UUID NOT NULL DEFAULT uuid_generate_v7(),
  org_id INTEGER REFERENCES org NOT NULL,
  idempotency_key VARCHAR(255),
  livemode BOOLEAN,
  path TEXT,
  hash_body TEXT,
  received_at BIGINT,
  received_by TEXT,
  PRIMARY KEY(id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.request ENABLE ROW LEVEL SECURITY;

-- REQUEST POLICY

CREATE POLICY "user can only view org request data"
ON public.request
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only insert org request data"
ON public.request
FOR INSERT
TO AUTHENTICATED
WITH CHECK (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only update org request data"
ON public.request
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

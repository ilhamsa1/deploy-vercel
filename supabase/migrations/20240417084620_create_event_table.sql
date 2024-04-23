-- create a public.event table for storing event information
CREATE TABLE public.event (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  org_id INTEGER REFERENCES org NOT NULL,
  request_id UUID REFERENCES request ON DELETE CASCADE,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  api_version TEXT,
  type TEXT,
  data JSONB,
  request JSONB,
  pending_webhooks INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(id)
);

-- enable RLS, we want to restrict access on this table
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- EVENT POLICY

CREATE POLICY "user can only view org event data"
ON public.event
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only insert org event data"
ON public.event
FOR INSERT
TO AUTHENTICATED
WITH CHECK (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

CREATE POLICY "user can only update org event data"
ON public.event
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(org_id) ) = true );

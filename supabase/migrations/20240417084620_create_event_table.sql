CREATE OR REPLACE FUNCTION private.count_pending_webhooks(event_id UUID)
RETURNS INTEGER AS $$
DECLARE
  pending_webhooks INTEGER;
BEGIN
  SELECT COUNT(*) INTO pending_webhooks FROM public.request_tracker rt WHERE (rt.body->>'id')::UUID = event_id::UUID;
  RETURN pending_webhooks;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- create a public.event table for storing event information
CREATE TABLE public.event (
  id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  org_id INTEGER REFERENCES org NOT NULL,
  request_id UUID REFERENCES request ON DELETE CASCADE,
  account_id BIGINT NOT NULL REFERENCES business_account ON DELETE CASCADE,
  api_version TEXT,
  type event_type,
  data JSONB,
  request JSONB,
  pending_webhooks INTEGER GENERATED ALWAYS AS (private.count_pending_webhooks(id)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(id)
);

-- enable RLS, we want to restrict access on this table
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;

-- EVENT POLICY

CREATE POLICY "user can only view org event data"
ON public.event
FOR SELECT
TO AUTHENTICATED, ANON
USING (
  ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true )
  OR
  ( (SELECT private.is_account_own_by_authenticated_user(account_id)) = true )
);

CREATE POLICY "user can only insert org event data"
ON public.event
FOR INSERT
TO AUTHENTICATED, ANON
WITH CHECK (
  ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true )
  OR
  ( (SELECT private.is_account_own_by_authenticated_user(account_id)) = true )
);

NOTIFY pgrst, 'reload schema';

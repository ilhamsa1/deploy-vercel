-- create a function to get user oid by auth uid
CREATE OR REPLACE FUNCTION private.get_org_for_authenticated_user(oid INTEGER)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY definer SET search_path = private
as $$
  SELECT CASE WHEN EXISTS (
    SELECT FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND deleted_at is NULL
  )
  THEN true
  ELSE false
  END
$$;

-- create a function to check if user is authenticated admin
CREATE OR REPLACE FUNCTION private.is_authenticated_org_role(oid INTEGER, roleName TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY definer SET search_path = private
as $$
  SELECT CASE WHEN EXISTS (
    SELECT FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND role = roleName AND deleted_at is NULL
  )
  THEN true
  ELSE false
  END;
$$;

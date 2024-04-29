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

-- create a function to check if user can view another user
CREATE OR REPLACE FUNCTION private.can_user_view_other_user(auth_user_id UUID, user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY definer SET search_path = private
as $$
DECLARE
  auth_user_id_role TEXT;
  user_id_role TEXT;
BEGIN
  SELECT role FROM user_orgs WHERE user_id = auth_user_id INTO auth_user_id_role;
  SELECT role FROM user_orgs WHERE user_id = user_id INTO user_id_role;
  IF auth_user_id_role = 'admin' THEN
    RETURN true;
  END IF;
  IF user_id_role = 'client' THEN
    RETURN true;
  END IF;
  RETURN false;
END
$$;
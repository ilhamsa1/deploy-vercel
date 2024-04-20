-- create a function to get user oid by auth uid
CREATE FUNCTION public.get_org_for_authenticated_user(oid INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY definer SET search_path = public
as $$
  DECLARE
    result BOOLEAN;
    orgs_count INTEGER;
  BEGIN
    SELECT COUNT(*) FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND deleted_at is NULL
    INTO orgs_count;

    if orgs_count > 0 then
      return true;
    else
      return false;
    end if;
  END;
$$;
-- create a function to get user role by auth uid
CREATE FUNCTION public.get_role_based_orgid_for_authenticated_user(oid INTEGER)
RETURNS TEXT
LANGUAGE sql
SECURITY definer SET search_path = public
as $$
  SELECT role FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND deleted_at is NULL
$$;
-- create a function to check if user is authenticated admin
CREATE FUNCTION public.is_authenticated_org_role(oid INTEGER, role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY definer SET search_path = public
as $$
  DECLARE
    result BOOLEAN;
    orgs_count INTEGER;
  BEGIN
    SELECT COUNT(*) FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND role = role AND deleted_at is NULL
    INTO orgs_count;

    if orgs_count > 0 then
      return true;
    else
      return false;
    end if;
  END;
$$;
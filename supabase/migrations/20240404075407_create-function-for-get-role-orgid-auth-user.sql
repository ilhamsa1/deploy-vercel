-- create a function to get user oid by auth uid
CREATE OR REPLACE FUNCTION public.get_org_for_authenticated_user(oid INTEGER)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY definer SET search_path = public
as $$
  BEGIN
    return exists(SELECT FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND deleted_at is NULL);
  END;
$$;

-- create a function to check if user is authenticated admin
CREATE OR REPLACE FUNCTION public.is_authenticated_org_role(oid INTEGER, role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY definer SET search_path = public
as $$
  BEGIN
    return exists(SELECT FROM public.user_orgs WHERE user_id = auth.current_uid() AND org_id = oid AND role = role AND deleted_at is NULL);
  END;
$$;

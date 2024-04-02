-- create a function to get user oid by auth uid
CREATE FUNCTION public.get_org_for_authenticated_user()
RETURNS INTEGER
LANGUAGE sql
SECURITY definer SET search_path = public
as $$
  SELECT oid FROM public.user_orgs WHERE uid = auth.uid()
$$;
-- create a function to get user role by auth uid
CREATE FUNCTION public.get_role_for_authenticated_user()
RETURNS TEXT
LANGUAGE sql
SECURITY definer SET search_path = public
as $$
  SELECT role FROM public.user_orgs WHERE uid = auth.uid()
$$;
-- user with oid can view their own org
CREATE POLICY "user can only view their own user org"
ON public.org
FOR SELECT
USING ( id in ( SELECT public.get_org_for_authenticated_user() ) );
-- current user auth can view their own user_org
CREATE POLICY "admin can organize their org users"
ON public.user_orgs
FOR SELECT
USING (
  (oid in ( SELECT public.get_org_for_authenticated_user() ))
  AND (( SELECT public.get_role_for_authenticated_user() ) = 'admin')
);
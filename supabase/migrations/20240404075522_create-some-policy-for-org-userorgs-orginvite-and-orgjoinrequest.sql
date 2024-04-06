-- ORG POLICY
-- user with oid can view their own org
CREATE POLICY "user can only view their own user org"
ON public.org
FOR SELECT
TO AUTHENTICATED
USING ( ( SELECT public.get_org_for_authenticated_user(id) ) = true );
-- admin user can update their own org
CREATE POLICY "admin user can update their own org"
ON public.org
FOR UPDATE
TO AUTHENTICATED
USING (
  (( SELECT public.get_org_for_authenticated_user(id) ) = true)
  AND
  (( SELECT public.get_role_based_orgid_for_authenticated_user(id) ) = 'admin')
);

-- USER_ORGS POLICY
-- user can see their user_org list, and admin user can see user_org with the same org list
CREATE POLICY "user can see their own user_orgs, and admin user can see user_orgs with the same org"
ON public.user_orgs
FOR SELECT
TO AUTHENTICATED
USING (
  (( auth.uid() = user_id ) AND ( deleted_at IS NULL ))
  OR
  (
    (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
    AND (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
    AND ( deleted_at IS NULL )
  )
);
-- user can update their own user_org list
CREATE POLICY "user can update their own user_org and admin user can update another user role"
ON public.user_orgs
FOR UPDATE
TO AUTHENTICATED
USING (
  (auth.uid() = user_id)
  OR
  (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
)
WITH CHECK (
  ( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = role
  OR
  ( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin'
);
-- user can add new user_orgs to join org more than 1
CREATE POLICY "user can add new user_orgs to join more than 1 org"
ON public.user_orgs
FOR INSERT
TO AUTHENTICATED
WITH CHECK (true);
-- admin user can kick out/delete user_orgs in the same org
CREATE POLICY "admin user can delete user_orgs in the same org"
ON public.user_orgs
FOR DELETE
TO AUTHENTICATED
USING (
  (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
  AND (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
);

-- ORG_INVITE TABLE
-- admin user can see invitation to join some one to org
CREATE POLICY "admin user can see list invitation new user to join org"
ON public.org_invite
FOR SELECT
TO AUTHENTICATED
USING (true);
-- user admin can create/insert user_orgs to new user into org
CREATE POLICY "user admin can create/insert user_orgs to new user into org"
ON public.org_invite
FOR INSERT
TO AUTHENTICATED
WITH CHECK (
  (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
  AND (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
);
-- user admin can create/insert user_orgs to new user into org
CREATE POLICY "user admin can change invitation role and all user can update to accepted the invitation"
ON public.org_invite
FOR UPDATE
TO AUTHENTICATED
USING (true);

-- ORG_JOIN_REQUEST TABLE
-- all user can see their own join request created and admin can see all incoming join request to the org
CREATE POLICY "user can see their own join request list and admin can see the whole join request in their org"
ON public.org_join_request
FOR SELECT
TO AUTHENTICATED
USING (
  (auth.uid() = user_id)
  OR
  (
    (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
    AND
    (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
  )
);
-- all user can insert join request to org
CREATE POLICY "user can insert new join request"
ON public.org_join_request
FOR INSERT
TO AUTHENTICATED
WITH CHECK (true);
-- admin user can update to accept join request in their org
CREATE POLICY "admin user can update join request"
ON public.org_join_request
FOR UPDATE
TO AUTHENTICATED
USING (
  (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
  AND (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
);
-- either user can cancel their join request and admin user can denied join request, cancel/denied will delete join request record
CREATE POLICY "all user can delete their join request and admin user can delete incoming join request"
ON public.org_join_request
FOR DELETE
TO AUTHENTICATED
USING (
  (auth.uid() = user_id)
  OR
  (
    (( SELECT public.get_org_for_authenticated_user(org_id) ) = true)
    AND
    (( SELECT public.get_role_based_orgid_for_authenticated_user(org_id) ) = 'admin')
  )
);
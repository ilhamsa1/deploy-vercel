-- USER POLICY
-- user allowed to select their own data
CREATE POLICY "can only view own user data"
ON public.user
FOR SELECT
TO AUTHENTICATED, ANON
USING (( select auth.current_uid() ) = id );
-- user allowed to update their own data
CREATE POLICY "can only update own user data"
ON public.user
FOR UPDATE
TO AUTHENTICATED, ANON
USING (( select auth.current_uid() ) = id );

-- ORG POLICY
-- user with oid can view their own org
CREATE POLICY "user can only view their own user org"
ON public.org
FOR SELECT
TO AUTHENTICATED
USING (( SELECT public.get_org_for_authenticated_user(id) ) = true );
-- admin user can update their own org
CREATE POLICY "admin user can update their own org"
ON public.org
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.is_authenticated_org_role(id, 'admin') ) = true );

-- USER_ORGS POLICY
-- user can see their user_org list, and admin user can see user_org with the same org list
CREATE POLICY "user can see their own user_orgs, and admin user can see user_orgs with the same org"
ON public.user_orgs
FOR SELECT
TO AUTHENTICATED
USING (
  (
    (( auth.current_uid() = user_id ))
    OR
    (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true )
  ) AND ( deleted_at IS NULL )
);
-- user can update their own user_org list
CREATE POLICY "only admin user can update user org. cannot change role (admin<>client)"
ON public.user_orgs
FOR UPDATE
TO AUTHENTICATED
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
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
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );

-- ORG_INVITE TABLE
-- user can see invitation to join org
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
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
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
  (auth.current_uid() = user_id)
  OR
  (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true )
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
USING (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true );
-- either user can cancel their join request and admin user can denied join request, cancel/denied will delete join request record
CREATE POLICY "all user can delete their join request and admin user can delete incoming join request"
ON public.org_join_request
FOR DELETE
TO AUTHENTICATED
USING (
  (auth.current_uid() = user_id)
  OR
  (( SELECT public.is_authenticated_org_role(org_id, 'admin') ) = true )
);
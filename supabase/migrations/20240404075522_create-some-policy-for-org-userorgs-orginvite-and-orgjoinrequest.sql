-- USER POLICY

CREATE POLICY "can only view own user data"
ON public.user
FOR SELECT
TO AUTHENTICATED, ANON
USING ( (SELECT private.can_user_view_other_user(auth.current_uid(), id)) = true ) ;

CREATE POLICY "can only update own user data"
ON public.user
FOR UPDATE
TO AUTHENTICATED
USING ( (SELECT auth.current_uid()) = id );

-- ORG POLICY

CREATE POLICY "user can only view their own user org"
ON public.org
FOR SELECT
TO AUTHENTICATED
USING ( (SELECT private.get_org_for_authenticated_user(id)) = true );

CREATE POLICY "admin user can update their own org"
ON public.org
FOR UPDATE
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(id, 'admin')) = true );

-- USER_ORGS POLICY

CREATE POLICY "user can see their own user_orgs, and admin user can see user_orgs with the same org"
ON public.user_orgs
FOR SELECT
TO AUTHENTICATED
USING (
  (
    ( (SELECT auth.current_uid()) = user_id )
    OR
    ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true )
  ) AND ( deleted_at IS NULL )
);

CREATE POLICY "user can add new user_orgs to join more than 1 org"
ON public.user_orgs
FOR INSERT
TO AUTHENTICATED
WITH CHECK (true);

CREATE POLICY "only admin user can update user org. cannot change role (admin<>client)"
ON public.user_orgs
FOR UPDATE
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

CREATE POLICY "admin user can delete user_orgs in the same org"
ON public.user_orgs
FOR DELETE
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

-- ORG_INVITE TABLE

CREATE POLICY "admin user can see list invitation new user to join org"
ON public.org_invite
FOR SELECT
TO AUTHENTICATED, ANON
USING (true);

CREATE POLICY "user admin can create/insert user_orgs to new user into org"
ON public.org_invite
FOR INSERT
TO AUTHENTICATED
WITH CHECK ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

CREATE POLICY "user admin can change invitation role and all user can update to accepted the invitation"
ON public.org_invite
FOR UPDATE
TO AUTHENTICATED, ANON
USING (true);

-- ORG_JOIN_REQUEST TABLE

CREATE POLICY "user can see their own join request list and admin can see the whole join request in their org"
ON public.org_join_request
FOR SELECT
TO AUTHENTICATED
USING (
  ( (SELECT auth.current_uid()) = user_id )
  OR
  ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true )
);

CREATE POLICY "user can insert new join request"
ON public.org_join_request
FOR INSERT
TO AUTHENTICATED
WITH CHECK (true);

CREATE POLICY "admin user can update join request"
ON public.org_join_request
FOR UPDATE
TO AUTHENTICATED
USING ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true );

CREATE POLICY "all user can delete their join request and admin user can delete incoming join request"
ON public.org_join_request
FOR DELETE
TO AUTHENTICATED
USING (
  ( (SELECT auth.current_uid()) = user_id )
  OR
  ( (SELECT private.is_authenticated_org_role(org_id, 'admin')) = true )
);

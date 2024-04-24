-- create a function to check business account is current own by authenticated user
CREATE OR REPLACE FUNCTION private.is_account_own_by_authenticated_user(accountId BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY definer SET search_path = private
as $$
  SELECT CASE WHEN EXISTS (
    SELECT FROM public.business_account WHERE user_id = auth.current_uid() AND id = accountId
  )
  THEN true
  ELSE false
  END;
$$;

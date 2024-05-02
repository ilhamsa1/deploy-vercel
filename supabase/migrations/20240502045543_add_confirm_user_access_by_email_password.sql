-- This function retrieves the API key associated with a specific secret ID for a given user from the database.
CREATE OR REPLACE FUNCTION security_confirm(id_of_user UUID, email_user TEXT, password_user TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY definer
SET search_path = extensions
AS $$
BEGIN
    -- Check if the authenticated user matches the provided user ID
  IF auth.uid() = id_of_user THEN
    RETURN EXISTS (SELECT id FROM auth.users WHERE id = auth.uid() AND id = id_of_user AND email = email_user AND encrypted_password = crypt(password_user::text, auth.users.encrypted_password));
  END IF;

  RETURN FALSE;
END;
$$;
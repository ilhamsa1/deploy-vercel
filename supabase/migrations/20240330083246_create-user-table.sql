-- crate a public.user table for storing auth user data
CREATE TABLE public.user (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_img TEXT,
  email TEXT,
  PRIMARY KEY (id)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;
-- user allowed to select their own data
CREATE POLICY "can only view own user data"
ON public.user
FOR SELECT
TO AUTHENTICATED
USING ( auth.uid() = id );
-- user allowed to update their own data
CREATE POLICY "can only update own user data"
ON public.user
FOR UPDATE
TO AUTHENTICATED
USING ( auth.uid() = id );
-- create a function to insert a row into public.user
CREATE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer SET search_path = public
as $$
BEGIN
  INSERT INTO public.user (id, display_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.raw_user_meta_data ->> 'email'
  );
  RETURN NEW;
END;
$$;
-- trigger the function every time a new user sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();
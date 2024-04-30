ALTER TABLE org_invite
DROP COLUMN code;

-- Create a computed field
CREATE OR REPLACE FUNCTION code(org_invite)
RETURNS text AS $$
  SELECT gen_short_code($1.id, gen_short_secret('_invite_'));
$$ LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE
SECURITY DEFINER SET search_path = 'extensions', 'public';

-- (optional) add an index on the computed field to speed up queries
DROP INDEX IF EXISTS org_invite_code_idx;
CREATE INDEX org_invite_code_idx ON org_invite (code(org_invite) text_pattern_ops) WITH (fillfactor = 50);
-- Creating the index may take some time (as a full table scan is needed)

-- (Optional) reload postgrest.org Schema Cache
NOTIFY pgrst, 'reload schema'
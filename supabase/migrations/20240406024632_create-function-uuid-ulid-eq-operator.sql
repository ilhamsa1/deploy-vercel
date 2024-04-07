-- create a function for uuid_ulid eq operator
CREATE OR REPLACE FUNCTION uuid_ulid_eq_operator(lhs_id UUID_ULID, rhs_id VARCHAR)
RETURNS BOOLEAN
AS
$$
  SELECT uuid_send(lhs_id) = parse_ulid(rhs_id);
$$
LANGUAGE sql
IMMUTABLE;

-- create operator ===
CREATE OPERATOR === (
  LEFTARG = UUID_ULID,
  RIGHTARG = varchar,
  FUNCTION = uuid_ulid_eq_operator,
  COMMUTATOR = ===,
  NEGATOR = !==,
  HASHES,
  MERGES
);
-- Create the ENUM type without the wildcard '*'
CREATE TYPE event_type_enum AS ENUM (
  '*',
  'payment_intent.created',
  'payment_intent.requires_action',
  'payment_intent.amount_capturable_updated'
);

-- Create the DOMAIN based on the ENUM type
CREATE DOMAIN event_type AS event_type_enum;

-- Remove the 'deprecated' value from the ENUM type
-- ALTER TYPE event_type_enum DROP VALUE 'deprecated';

-- Add a constraint to the DOMAIN to exclude the 'deprecated' value
-- ALTER DOMAIN event_type ADD CONSTRAINT valid_event_type CHECK (VALUE NOT IN ('deprecated'));

-- Add a new value to the ENUM type
-- ALTER TYPE event_type_enum ADD VALUE 'payment_intent.created';

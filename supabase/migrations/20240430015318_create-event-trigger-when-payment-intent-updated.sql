-- Enable the "pg_net" extension if it's not already created.
-- This extension is assumed to be necessary for the function's operations.
-- CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create or replace the function that handles changes in payment intents.
CREATE OR REPLACE FUNCTION private.handle_payment_intent_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  apiVersion TEXT;    -- To store the API version formatted as YYYY-MM-DD
  eventType TEXT;     -- To determine the type of event based on payment intent status
  eventData JSONB;    -- JSONB object to hold event data
BEGIN
  -- Determine the API version based on the current date
  apiVersion := TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD');

  -- Determine the event type based on the status of the payment_intent
  IF NEW.status = 'requires_payment_method' THEN
    eventType := 'payment_intent.created';
  ELSIF NEW.status = 'requires_actions' THEN
    eventType := 'payment_intent.requires_action';
  ELSIF NEW.status = 'requires_confirmation' THEN
    eventType := 'payment_intent.amount_capturable_updated';
  ELSIF NEW.status = 'processing' THEN
    eventType := 'payment_intent.processing';
  ELSIF NEW.status = 'cancelled' THEN
    eventType := 'payment_intent.cancelled';
  ELSIF NEW.status = 'succeeded' THEN
    eventType := 'payment_intent.succeeded';
  ELSE
    eventType := 'payment_intent.pending'; -- Default event type for other statuses
  END IF;

  -- Construct the event data as a JSONB object
  eventData := jsonb_build_object(
    'object', to_jsonb(NEW),
    'previous_attributes', to_jsonb(OLD)
  );

  -- Insert a new event if it's a new record or the status has changed
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.event (
      org_id,
      account_id,
      api_version,
      type,
      data
    ) VALUES (
      NEW.org_id,
      NEW.account_id,
      apiVersion,
      eventType::public.event_type_enum,  -- Assuming event_type_enum is a defined ENUM type
      eventData
    );
  END IF;

  -- Return the new or updated row to continue with the operation
  RETURN NEW;
END;
$$;

-- Modify the function's search path for enhanced security
ALTER FUNCTION private.handle_payment_intent_change() SET search_path = private;

-- Trigger to handle INSERT or UPDATE operations on the payment_intent table
CREATE OR REPLACE TRIGGER on_insert_update_payment_event_trigger
AFTER INSERT OR UPDATE ON public.payment_intent
FOR EACH ROW
EXECUTE FUNCTION private.handle_payment_intent_change();

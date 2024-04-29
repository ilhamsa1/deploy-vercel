CREATE OR REPLACE FUNCTION private.handle_event_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  webhook_endpoint_item RECORD;
BEGIN
  -- Retrieve webhook endpoints for the organization and enabled event
  FOR webhook_endpoint_item IN 
    SELECT * 
    FROM public.webhook_endpoint 
    WHERE account_id = NEW.account_id
    AND NEW.type::event_type_enum = ANY(enabled_events::event_type_enum[])
    AND status = 'enabled'
  LOOP
    -- Call request_wrapper for each webhook endpoint
    PERFORM request_wrapper(
      'POST',
      webhook_endpoint_item.url,
      NULL,
      to_jsonb(NEW), -- Ensure this conversion meets your data needs
      '{"Content-Type": "application/json"}'::JSONB,
      '{"webhook_origin": "event"}'::JSONB
    );
  END LOOP;

  RETURN NEW; -- This ensures the insert operation completes normally
END;
$$;

CREATE OR REPLACE TRIGGER event_insert_trigger
AFTER INSERT ON public.event -- Make sure the schema is specified if not public
FOR EACH ROW
EXECUTE FUNCTION private.handle_event_inserted();

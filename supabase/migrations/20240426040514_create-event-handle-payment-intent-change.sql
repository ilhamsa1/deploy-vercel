CREATE OR REPLACE FUNCTION private.handle_event_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer 
SET search_path = private
AS $$
BEGIN
  -- Retrieve webhook endpoints for the organization and enabled event
  FOR webhook_endpoint_item IN 
    SELECT * 
    FROM webhook_endpoint 
    WHERE org_id = NEW.org_id 
      AND NEW.event_type = ANY(enabled_events)
  LOOP
    -- Call request_wrapper for each webhook endpoint
    PERFORM request_wrapper(
      'POST', 
      webhook_endpoint_item.url,
      undefined,
      NEW
    );
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE TRIGGER event_insert_trigger
AFTER INSERT ON event
FOR EACH ROW
EXECUTE FUNCTION private.handle_event_inserted();

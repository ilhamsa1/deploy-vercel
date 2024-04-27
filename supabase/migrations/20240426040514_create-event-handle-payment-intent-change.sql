CREATE OR REPLACE FUNCTION private.handle_event_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer 
SET search_path = public
AS $$
DECLARE
  webhook_endpoint_item RECORD;
BEGIN
  -- Retrieve webhook endpoints for the organization and enabled event
  FOR webhook_endpoint_item IN 
    SELECT * 
    FROM public.webhook_endpoint 
    WHERE org_id = NEW.org_id 
      -- AND NEW.type::public.event_type = ANY(enabled_events::public.event_type[])
  LOOP
      -- RAISE EXCEPTION 'Method must be DELETE, POST, or GET. URL: %', webhook_endpoint_item.url;

    -- Call request_wrapper for each webhook endpoint
   PERFORM request_wrapper(
  'POST',
  webhook_endpoint_item.url,
  NULL,
  jsonb_build_object(
    'id', NEW.id
    -- Add more columns as needed
  ),
  '{"Content-Type": "application/json"}'::JSONB
);
  END LOOP;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER event_insert_trigger
AFTER INSERT ON event
FOR EACH ROW
EXECUTE FUNCTION private.handle_event_inserted();

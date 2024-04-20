CREATE OR REPLACE FUNCTION public.allocate_payment_methods() 
RETURNS TRIGGER
SECURITY definer
SET search_path = public
AS $$
DECLARE
    each_item payment_intent;  -- Declare as a record type for each row
BEGIN
    
    -- If the new row status is 'require_payment_method', process it
    IF NEW.status = 'require_payment_method' THEN
        PERFORM allocate_payment_method_single(NEW);
    END IF;

    -- Scan items that are not yet being processed
    FOR each_item IN
        SELECT * FROM payment_intent WHERE status = 'require_payment_method'
    LOOP
        -- Process each pending item
        PERFORM allocate_payment_method_single(each_item);
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER on_allocate_payment_trigger
AFTER INSERT OR UPDATE ON public.payment_intent
FOR EACH ROW
WHEN (NEW.status = 'require_payment_method')
EXECUTE FUNCTION allocate_payment_methods();

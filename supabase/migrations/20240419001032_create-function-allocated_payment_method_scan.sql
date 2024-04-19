CREATE OR REPLACE FUNCTION public.allocate_payment_method(item public.payment_intent DEFAULT NULL) RETURNS VOID AS $$
DECLARE
    each_item payment_intent;  -- Declare as a record type for each row
BEGIN
    
    -- If item is provided, process it as well
    IF item IS NOT NULL THEN
        PERFORM allocate_payment_method_single(item);
    END IF;

    -- Scan items that are not yet being processed
    FOR each_item IN
        SELECT * FROM payment_intent WHERE status = 'require_payment_method'
    LOOP
        -- Process each pending item
        PERFORM allocate_payment_method_single(each_item);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
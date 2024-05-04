CREATE OR REPLACE FUNCTION private.allocate_payment_methods(item public.payment_intent DEFAULT NULL) RETURNS VOID AS $$
DECLARE
    each_item payment_intent;  -- Declare as a record type for each row
BEGIN
    
    -- Scan items that are not yet being processed
    FOR each_item IN
        SELECT * FROM payment_intent WHERE status = 'requires_payment_method' ORDER BY id ASC
        -- TODO: If an argument 'item' is provided, only scan the payment intents preceding it
        -- SELECT * FROM payment_intent WHERE status = 'requires_payment_method' AND (item IS NULL OR id < item.id) ORDER BY id ASC
    LOOP
        -- Process each pending item
        PERFORM private.allocate_payment_method_single(each_item);
    END LOOP;   

    -- If item is provided, process it as well
    IF item IS NOT NULL THEN
        PERFORM private.allocate_payment_method_single(item);
    END IF;
END;
$$ LANGUAGE plpgsql;
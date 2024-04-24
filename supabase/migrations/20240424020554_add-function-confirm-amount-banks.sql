CREATE OR REPLACE FUNCTION public.confirm_amount_banks(item public.bank_tx) RETURNS VOID AS $$
DECLARE
    each_item payment_intent;  -- Declare as a record type for each row
BEGIN
    
    -- Scan items that are not yet being processed
    FOR each_item IN
        SELECT * FROM payment_intent 
        WHERE status = 'requires_payment_method' 
        AND next_action->'display_bank_transfer'->>'amount_remaining' = item.amount
        AND next_action->'display_bank_transfer'->>'amount_remaining_e' = item.amount_e
        AND next_action->'display_bank_transfer'->>'currency' = item.currency
        ORDER BY id ASC
    LOOP
        -- Process each pending item
        PERFORM confirm_payment_intent_by_bank_tx(each_item, item);
    END LOOP;   
END;
$$ LANGUAGE plpgsql;

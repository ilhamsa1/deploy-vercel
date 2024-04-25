CREATE OR REPLACE FUNCTION private.bank_payment_matchings(item public.bank_tx) RETURNS VOID AS $$
DECLARE
    each_item payment_intent;
BEGIN
    FOR each_item IN
        SELECT * FROM payment_intent 
        WHERE status = 'requires_action' 
        AND ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'amount_remaining')::numeric = item.amount
        AND ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'amount_remaining_e')::numeric = item.amount_e
        AND ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'currency') = item.currency
        ORDER BY id ASC
    LOOP
        PERFORM private.confirm_payment_intent_by_bank_tx(each_item, item);
    END LOOP;   
END;
$$ LANGUAGE plpgsql;

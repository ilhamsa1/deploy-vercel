CREATE OR REPLACE FUNCTION public.allocate_payment_method_single(item public.payment_intent) RETURNS BOOLEAN AS $$
DECLARE
    row payment_intent;
    row_bank_account bank_account;
BEGIN

    SELECT * INTO STRICT row 
    FROM payment_intent
      JOIN business_account
      on business_account.id = payment_intent.account_id
    WHERE id = item.id AND status = 'require_payment_method' 
    LIMIT 1 
    FOR UPDATE SKIP LOCKED;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Get available bank account
    
    SELECT * FROM bank_account INTO STRICT row_bank_account
    JOIN bank
    ON bank.id = bank_account.bank_id
    WHERE bank_account.org_id = row.id
    ORDER BY bank_account.last_allocated_at DESC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    UPDATE payment_intent 
    SET 
      status = 'requires_action',
      payment_method = CONCAT(row_bank_account.tag, '_', row_bank_account.id) 
    WHERE id = row.id;

    UPDATE bank_account 
    SET last_allocated_at = NOW()
    WHERE id = row.id;

    RETURN TRUE;

END;
$$ LANGUAGE plpgsql STRICT;
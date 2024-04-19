CREATE OR REPLACE FUNCTION public.allocate_payment_method_single(item public.payment_intent) RETURNS BOOLEAN AS $$
DECLARE
    row payment_intent;
    row_bank_account bank_account;
    row_business_account business_account;
    row_bank bank;
BEGIN

    -- Retrieve payment intent and associated business account
    SELECT pi.*, ba.org_id::TEXT INTO STRICT row 
    FROM payment_intent pi
    JOIN business_account ba ON ba.id = pi.account_id
    WHERE pi.id = item.id AND pi.status = 'require_payment_method' 
    LIMIT 1 
    FOR UPDATE SKIP LOCKED;

    -- Retrieve bank account associated with business account (NOTE: ENCOUNTER ISSUE CAN'T READ JOIN TABLE OF SELECT INTO ROW')
    SELECT ba.* INTO STRICT row_business_account
    FROM business_account ba
    WHERE ba.id = row.account_id
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Get available bank account
    SELECT ba.* INTO STRICT row_bank_account
    FROM bank_account ba
    INNER JOIN bank b ON ba.bank_id = b.id
    WHERE ba.org_id = row_business_account.org_id
    ORDER BY ba.last_allocated_at DESC
    LIMIT 1
    FOR UPDATE SKIP LOCKED;

    -- Retrieve bank information (NOTE: ENCOUNTER ISSUE CAN'T READ JOIN TABLE OF SELECT INTO ROW')
    SELECT b.* INTO STRICT row_bank
    FROM bank b
    WHERE b.id = row_bank_account.bank_id
    LIMIT 1;

    -- Update payment_intent and bank_account
    UPDATE payment_intent 
    SET 
      status = 'requires_action',
      payment_method = CONCAT(row_bank.tag, '_', row_bank_account.id) 
    WHERE id = row.id;

    UPDATE bank_account 
    SET last_allocated_at = NOW()
    WHERE id = row_bank_account.id; 

    RETURN TRUE;

END;
$$ LANGUAGE plpgsql STRICT;

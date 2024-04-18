CREATE OR REPLACE FUNCTION public.allocate_payment_method_single(item public.payment_intent) RETURNS BOOLEAN AS $$
DECLARE
    row payment_intent;
BEGIN

    SELECT * INTO STRICT row 
    FROM payment_intent 
    WHERE id = item.id AND status = 'require_payment_method' 
    LIMIT 1 
    FOR UPDATE SKIP LOCKED;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    UPDATE payment_intent 
    SET status = 'requires_action'
    WHERE id = row.id;

    RETURN TRUE;

END;
$$ LANGUAGE plpgsql STRICT;
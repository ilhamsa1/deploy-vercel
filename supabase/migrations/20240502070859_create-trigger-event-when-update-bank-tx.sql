CREATE OR REPLACE FUNCTION private.handler_update_bank_tx_trigger() 
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if 'posted_at' was previously empty and is now set
    IF (OLD.posted_at IS NULL AND NEW.posted_at IS NOT NULL) THEN
        PERFORM private.update_succeeded_payment_intent(NEW);
    END IF;

    RETURN NEW;  -- Return the modified NEW row for the trigger
END;
$$;

-- Create a trigger that executes the handler_update_bank_tx_trigger function
-- after each update operation on the bank_tx table in the public schema.

CREATE OR REPLACE TRIGGER on_update_bank_tx_trigger
AFTER UPDATE ON public.bank_tx
FOR EACH ROW
EXECUTE FUNCTION private.handler_update_bank_tx_trigger();

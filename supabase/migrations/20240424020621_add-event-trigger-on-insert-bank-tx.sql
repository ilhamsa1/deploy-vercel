CREATE OR REPLACE FUNCTION private.handler_bank_tx_trigger() 
RETURNS TRIGGER
SECURITY definer
SET search_path = public
AS $$
BEGIN
        
    PERFORM private.bank_payment_matchings(NEW);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that executes the handler_payment_intent_trigger function
-- after each insert or update operation on the payment_intent table.

CREATE OR REPLACE TRIGGER on_insert_bank_tx_trigger
AFTER INSERT ON public.bank_tx
FOR EACH ROW
EXECUTE FUNCTION private.handler_bank_tx_trigger();

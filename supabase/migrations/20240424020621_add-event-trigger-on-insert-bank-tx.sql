CREATE OR REPLACE FUNCTION public.handler_bank_tx_trigger() 
RETURNS TRIGGER
SECURITY definer
SET search_path = public
AS $$
BEGIN
        
    PERFORM public.confirm_amount_banks(NEW);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that executes the handler_payment_intent_trigger function
-- after each insert or update operation on the payment_intent table.

CREATE OR REPLACE TRIGGER on_insert_bank_tx_trigger
AFTER INSERT ON public.payment_intent
FOR EACH ROW
EXECUTE FUNCTION public.handler_bank_tx_trigger();

-- This function is triggered whenever a new row is inserted or updated in the payment_intent table.
-- It checks the status of the payment intent and performs actions accordingly.

CREATE OR REPLACE FUNCTION public.handler_payment_intent_trigger() 
RETURNS TRIGGER
SECURITY definer
SET search_path = public
AS $$
DECLARE
    each_item payment_intent;  -- Declare as a record type for each row
BEGIN
    -- Check if the status of the new row is 'requires_payment_method'
    IF NEW.status = 'requires_payment_method' THEN
        -- If so, allocate payment methods
        PERFORM allocate_payment_methods(NEW);
    END IF;

    -- TODO: Handle status changes to 'requires_confirmation'
    -- IF NEW.status = 'requires_confirmation' THEN
    --     Perform function when status is requires_confirmation
    -- END IF;

    -- TODO: Handle status changes to 'succeeded'
    -- IF NEW.status = 'succeeded' THEN
    --     Perform function when status is succeeded
    -- END IF;

    -- Return the new row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Create a trigger that executes the handler_payment_intent_trigger function
-- after each insert or update operation on the payment_intent table.

CREATE OR REPLACE TRIGGER on_insert_or_update_payment_intent_trigger
AFTER INSERT OR UPDATE ON public.payment_intent
FOR EACH ROW
EXECUTE FUNCTION handler_payment_intent_trigger();

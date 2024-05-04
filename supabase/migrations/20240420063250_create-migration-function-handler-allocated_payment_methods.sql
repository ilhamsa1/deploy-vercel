CREATE OR REPLACE FUNCTION private.handler_payment_intent_trigger() 
RETURNS TRIGGER
SECURITY definer
SET search_path = private
AS $$
BEGIN
    -- Check the status of the new row
    IF NEW.status = 'requires_payment_method' THEN
        -- Allocate payment methods if status is 'requires_payment_method'
        PERFORM private.allocate_payment_methods(NEW);
        
    -- TODO: Handle other status changes conditions
    -- ELSIF NEW.status = 'requires_confirmation' THEN
    --     Perform function when status is requires_confirmation
        
    -- ELSIF NEW.status = 'succeeded' THEN
    --     Perform function when status is succeeded
    
    -- ELSE
    --     Handle other cases (if necessary)
    --     You can log a message or perform other actions here
    END IF;

    -- Return the new row
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that executes the handler_payment_intent_trigger function
-- after each insert or update operation on the payment_intent table.

CREATE OR REPLACE TRIGGER on_insert_or_update_payment_intent_trigger
AFTER INSERT OR UPDATE ON public.payment_intent
FOR EACH ROW
EXECUTE FUNCTION public.handler_payment_intent_trigger();

CREATE UNIQUE INDEX unique_amount_remaining_payment_method_idx
ON payment_intent (
    ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'amount_remaining'),
    ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'amount_remaining_e'),
    ((next_action::jsonb->>'display_bank_transfer_instructions')::jsonb->>'currency'),
    payment_method
)
WHERE next_action IS NOT NULL 
    AND status = 'requires_action' 
    AND payment_method IS NOT NULL;

CREATE UNIQUE INDEX unique_amount_remaining_payment_method_idx
ON payment_intent (
    (next_action->>'display_bank_transfer'->>'amount_remaining'),
    (next_action->>'display_bank_transfer'->>'amount_remaining_e'),
    (next_action->>'display_bank_transfer'->>'currency'),
    payment_method
)
WHERE next_action IS NOT NULL 
    AND status = 'requires_payment_method' 
    AND payment_method IS NOT NULL;

CREATE OR REPLACE FUNCTION private.handle_cancel(payment_intent_id UUID) RETURNS BOOLEAN AS $$
{
    // Define constants
    const ERROR_MESSAGES = {
        CANNOT_CANCEL: 'Cannot cancel payment intent',
        AUTO_CONFIRM_IN_PROGRESS: 'Cannot be cancelled as auto-confirm already in progress'
    };

    const PAYMENT_INTENT_STATUS = {
        CANCELLED: 'canceled'
    };

    try {
        // Retrieve payment intent row
        const row = plv8.execute(
            "SELECT pi.* " +
            "FROM payment_intent pi " +
            "WHERE pi.id = $1 " +
            "LIMIT 1 " +
            "FOR UPDATE SKIP LOCKED",
            [payment_intent_id]
        )[0];

        // Retrieve payment intent details
        const pi_next_action_amount = row.next_action.display_bank_transfer_instructions.amount_remaining;
        const pi_next_action_amount_e = row.next_action.display_bank_transfer_instructions.amount_remaining_e;
        const pi_next_action_currency = row.next_action.display_bank_transfer_instructions.currency;

        // Count the number of bank_tx records with associated bank_payment_tx records
        const bank_tx_with_payment_tx_count = plv8.execute(
            "SELECT COUNT(*) AS count " +
            "FROM bank_tx bt " +
            "WHERE bt.amount = $1 " +
            "AND bt.amount_e = $2 " +
            "AND bt.currency = $3 " +
            "AND EXISTS (" +
            "    SELECT 1 " +
            "    FROM bank_payment_tx bpt " +
            "    WHERE bpt.btx = bt.id" +
            ")",
            [pi_next_action_amount, pi_next_action_amount_e, pi_next_action_currency]
        )[0].count;

        // Check if there are any bank_tx records without associated bank_payment_tx records
        if (bank_tx_with_payment_tx_count > 0) {
            // Error: Cannot cancel as auto-confirm already in progress
            throw new Error(ERROR_MESSAGES.AUTO_CONFIRM_IN_PROGRESS);
        } else {
            // All conditions met, allow cancellation
            // Update payment_intent table with new status
            plv8.execute(
                "UPDATE payment_intent SET " +
                "status = $1 " +
                "WHERE id = $2",
                [PAYMENT_INTENT_STATUS.CANCELLED, payment_intent_id]
            );
            return true;
        }
  
    } catch (error) {
        // Log error
        // TODO: CREATE LOG ERROR
        throw new Error(error);

        // Return false indicating cancellation failed
        return false;
    }
}
$$ LANGUAGE plv8 STRICT;

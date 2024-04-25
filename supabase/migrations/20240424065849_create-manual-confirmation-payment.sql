CREATE OR REPLACE FUNCTION private.confirm_payment_manually(
    payment_intent_id UUID,
    bank_details JSONB
) RETURNS BOOLEAN AS $$
{
    // Define constants
    const PAYMENT_INTENT_STATUS = {
        PROCESSING: 'processing',
        REQUIRES_ACTION: 'requires_action'
    };

    try {
        plv8.subtransaction(function(){
            // Retrieve payment intent
            const row = plv8.execute(
                "SELECT pi.* " +
                "FROM payment_intent pi " +
                "WHERE pi.id = $1 AND pi.status = $2 " +
                "LIMIT 1 " +
                "FOR UPDATE SKIP LOCKED",
                [payment_intent_id, PAYMENT_INTENT_STATUS.REQUIRES_ACTION]
            )[0];

            // If payment intent not found or not in the required state, return false
            if (!row) {
                return false;
            }

            // Retrieve bank transaction
            const bank_tx_row = plv8.execute(
                "SELECT btx.* " +
                "FROM bank_tx btx " +
                "WHERE btx.amount = $1 AND btx.amount_e = $2 AND btx.currency = $3 " +
                "LIMIT 1 " +
                "FOR UPDATE SKIP LOCKED",
                [bank_details.amount, bank_details.amount_e, bank_details.currency]
            )[0];

            if (!bank_tx_row) {
                return false;
            }

            // Check if remaining amount matches
            // mandatory if nominal is incorrect, otherwise payment considered not yet actioned 
            if (row.next_action.display_bank_transfer_instructions.amount_remaining === bank_details.amount) {
                return false;
            }

            // Insert payment transaction
            const payment_tx_row = plv8.execute(
                "INSERT INTO payment_tx(pi_id, org_id, amount, amount_e, currency, payment_method, status) " +
                "VALUES($1, $2, $3, $4, $5, $6, $7) " +
                "RETURNING *",
                [
                    row.id,
                    row.org_id,
                    row.amount,
                    row.amount_e,
                    row.currency,
                    row.payment_method,
                    PAYMENT_TX_STATUS.SUCCEEDED
                ]
            )[0];

            // Insert into bank_payment_tx table
            const bank_payment_tx_row = plv8.execute(
                "INSERT INTO bank_payment_tx(ptx, btx, created_at) " +
                "VALUES($1, $2, NOW()) " +
                "RETURNING *",
                [payment_tx_row.id, bank_tx_row.id]
            )[0];

            // Update payment_intent table with new status
            plv8.execute(
                "UPDATE payment_intent SET " +
                "status = $1 " +
                "WHERE id = $2",
                [PAYMENT_INTENT_STATUS.PROCESSING, row.id]
            );

            // Return true indicating successful allocation
            return true;
        });

        return true;
    } catch(error) {
        // TODO: CREATE LOG ERROR
        return false;
    }
}
$$ LANGUAGE plv8 STRICT;

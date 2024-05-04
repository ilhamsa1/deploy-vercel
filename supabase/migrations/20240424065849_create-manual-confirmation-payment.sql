CREATE OR REPLACE FUNCTION public.confirm_payment_manually(
    payment_intent_id UUID,
    payment_method TEXT,
    bank_tx_selector JSONB
) RETURNS BOOLEAN 
SECURITY definer
SET search_path = public
AS $$
{
    // Define constants
    const PAYMENT_INTENT_STATUS = {
      PROCESSING: 'processing',
      REQUIRES_ACTION: 'requires_action'
    };

    const PAYMENT_TX_STATUS = {
      SUCCEEDED: 'succeeded',
      PENDING: 'pending'
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

            const transactedAt = bank_tx_selector.transacted_at || NULL

            let query = "SELECT btx.* FROM bank_tx btx WHERE btx.amount = $1 AND btx.amount_e = $2 AND btx.currency = $3";
            const params = [bank_tx_selector.amount, bank_tx_selector.amount_e, bank_tx_selector.currency];

            // Conditionally add the transacted_at filter if it is not null
            if (transactedAt !== null) {
                query += " AND btx.transacted_at = $4";
                params.push(transactedAt);
            }
    
            query += " LIMIT 1 FOR UPDATE SKIP LOCKED";

            // Retrieve bank transaction
            const bank_tx_row = plv8.execute(query, params)[0];

            if (!bank_tx_row) {
                return false;
            }

            // Check if remaining amount matches
            // mandatory if nominal is incorrect, otherwise payment considered not yet actioned 
            if (row.next_action.display_bank_transfer_instructions.amount_remaining === bank_tx_selector.amount) {
                return false;
            }

            const instruction_type = 'ph_bank_transfer'
            const payment_method_details = {
              type: instruction_type,
              [instruction_type]: {
                tx: bank_tx_item.id
              }
            }

            const payment_tx_status = bank_tx_row.posted_at === null ? PAYMENT_TX_STATUS.PENDING : PAYMENT_TX_STATUS.SUCCEEDED

            // Insert payment transaction
            const payment_tx_row = plv8.execute(
                "INSERT INTO payment_tx(pi_id, org_id, amount, amount_e, currency, payment_method, payment_method_details, status) " +
                "VALUES($1, $2, $3, $4, $5, $6, $7, $8) " +
                "RETURNING *",
                [
                    row.id,
                    row.org_id,
                    bank_tx_row.amount,
                    bank_tx_row.amount_e,
                    bank_tx_row.currency,
                    row.payment_method,
                    payment_method_details,
                    PAYMENT_TX_STATUS.PENDING
                ]
            )[0];

            // Insert into bank_payment_tx table
            const bank_payment_tx_row = plv8.execute(
                "INSERT INTO bank_payment_tx(ptx, btx, created_at) " +
                "VALUES($1, $2, NOW()) " +
                "RETURNING *",
                [payment_tx_row.id, bank_tx_row.id]
            )[0];

        // Sum the amount of all related payment transactions
        const payment_tx_sum = plv8.execute(
            "SELECT SUM(amount) AS sum FROM payment_tx WHERE pi_id = $1 AND status = 'succeeded' ",
            [payment_tx_row.id]
        )[0].sum;

        if (payment_tx_sum >= payment_tx_row.amount) {
                // Update payment_intent table with new status
            plv8.execute(
                "UPDATE payment_intent SET " +
                "status = $1 " +
                "WHERE id = $2",
                [PAYMENT_INTENT_STATUS.PROCESSING, payment_tx_row.id]
            );
          } else {
              plv8.execute(
                "UPDATE payment_intent SET status = 'requires_payment_method' WHERE id = $1",
                [payment_tx_row.id]
            );
          }

            // Return true indicating successful allocation
            return true;
        });

        return true;
    } catch(error) {
      throw new Error(error)
        // TODO: CREATE LOG ERROR
        return false;
    }
}
$$ LANGUAGE plv8 STRICT;

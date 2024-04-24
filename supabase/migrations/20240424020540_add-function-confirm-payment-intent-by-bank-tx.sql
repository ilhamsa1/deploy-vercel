
CREATE OR REPLACE FUNCTION public.confirm_payment_intent_by_bank_tx(payment_intent_item payment_intent, bank_tx_item public.bank_tx) RETURNS BOOLEAN AS $$
BEGIN
    // Define constants
    const PAYMENT_INTENT_STATUS = {
      PROCESSING: 'processing',
      REQUIRES_ACTION: 'requires_action'
    };

    const PAYMENT_TX_STATUS = {
      SUCCEEDED: 'succeeded',
      FAILED: 'failed'
    };

    const CONFIRMATION_METHOD = {
      MANUAL: 'manual',
      AUTOMATIC: 'automatic'
    };
    try {
        // Start PL/v8 subtransaction
        plv8.subtransaction(function(){
            // Insert into payment_tx table
            const paymentTxRow = plv8.execute(
              "INSERT INTO payment_tx(amount, amount_e, currency, payment_method, status) " +
              "VALUES($1, $2, $3, $4, $5) " +
              "RETURNING *",
              [item.amount, item.amount_e, item.currency, PAYMENT_INTENT_STATUS.SUCCEEDED]
            )[0];

            // Update payment_intent table with new status, next action, and payment method
            plv8.execute(
              "UPDATE payment_intent SET " +
              "status = $1, " +
              "confirmation_method = $2 " +
              "WHERE id = $3",
              [PAYMENT_INTENT_STATUS.PROCESSING, CONFIRMATION_METHOD.AUTOMATIC, payment_intent_item.id]
            );

            // Insert into bank_payment_tx table
            const bankPaymentTxRow = plv8.execute(
              "INSERT INTO bank_payment_tx(btx, ptx, created_at) " +
              "VALUES($1, $2, $3) " +
              "RETURNING *",
              [paymentTxRow.id, bank_tx_item.id, now()]
            )[0];

            // Return true indicating successful allocation
            return true;
        });

        return true;
    } catch(error) {
      return false;
    }
      
END;
$$ LANGUAGE plv8 STRICT;

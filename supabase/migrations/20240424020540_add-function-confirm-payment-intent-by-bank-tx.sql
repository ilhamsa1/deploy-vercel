
CREATE OR REPLACE FUNCTION public.confirm_payment_intent_by_bank_tx(payment_intent_item payment_intent, bank_tx_item public.bank_tx) RETURNS BOOLEAN AS $$
{
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

            // Retrieve bank account associated with business account
            const row_business_account = plv8.execute(
              "SELECT * FROM business_account WHERE id = $1 LIMIT 1",
              [payment_intent_item.account_id]
            )[0];

            const paymentTxRow = plv8.execute(
              "INSERT INTO payment_tx(pi_id, org_id, amount, amount_e, currency, payment_method, status) " +
              "VALUES($1, $2, $3, $4, $5, $6, $7) " +
              "RETURNING *",
              [
                payment_intent_item.id,
                row_business_account.org_id,
                payment_intent_item.amount,
                payment_intent_item.amount_e,
                payment_intent_item.currency,
                payment_intent_item.payment_method,
                PAYMENT_TX_STATUS.SUCCEEDED
              ]
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
              "INSERT INTO bank_payment_tx(ptx, btx, created_at) " +
              "VALUES($1, $2, NOW()) " +
              "RETURNING *",
              [paymentTxRow.id, bank_tx_item.id]
            )[0];

            // Return true indicating successful allocation
            return true;
        });

        return true;
    } catch(error) {
      // TODO: logging for error
      return false;
    }
}
$$ LANGUAGE plv8 STRICT;

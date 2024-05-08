CREATE OR REPLACE FUNCTION private.allocate_payment_method_single(item payment_intent) RETURNS BOOLEAN AS $$
{
    const PAYMENT_INTENT_STATUS = {
      REQUIRES_PAYMENT_METHOD: "requires_payment_method",
      REQUIRES_ACTION: "requires_action",
    };

    const LIMIT_UNIQUE_AMOUNT_BANK_ACCOUNT = 29;
  
    try {
      plv8.subtransaction(function(){
        // Retrieve payment intent and associated business account
        const row = plv8.execute(
            "SELECT * " +
            "FROM payment_intent pi " +
            "WHERE pi.id = $1 AND pi.status = $2 " +
            "LIMIT 1 " +
            "FOR UPDATE SKIP LOCKED",
            [item.id, PAYMENT_INTENT_STATUS.REQUIRES_PAYMENT_METHOD]
        )[0];

        // If payment intent not found or not in the required state, return false
        if (!row) {
            return false;
        }
        
        // Retrieve bank account associated with business account
        const row_business_account = plv8.execute(
            "SELECT * FROM business_account WHERE id = $1 LIMIT 1",
            [row.account_id]
        )[0];

        // If business account not found, return false
        if (!row_business_account) {
            throw new Error('There is no business account');
        }

        let selected_bank_account;
        let count_payment_intent;
        
        // Get available bank accounts
        const row_bank_accounts = plv8.execute(
            "SELECT ba.* " +
            "FROM bank_account ba " +
            "INNER JOIN bank b ON ba.bank_id = b.id " +
            "WHERE ba.org_id = $1 " +
            "ORDER BY ba.last_allocated_at ASC NULLS FIRST",
            [row_business_account.org_id]
        );

        // Iterate through bank accounts
        for (let i = 0; i < row_bank_accounts.length; i++) {
            const row_bank_account = row_bank_accounts[i];
            // Construct payment method
            const payment_method = 'bank_account_' + row_bank_account.id;
            // Check count of payment intents for the current bank account
            count_payment_intent = plv8.execute(
                "SELECT count(*) " +
                "FROM payment_intent pi " +
                "WHERE pi.amount = $1 AND pi.status = $2 AND pi.id != $3 AND payment_method = $4 AND amount_e = $5",
                [row.amount, PAYMENT_INTENT_STATUS.REQUIRES_ACTION, item.id, payment_method, row.amount_e]
            )[0];
            // If count exceeds the limit, switch to the next bank account
            if (Number(count_payment_intent.count) <= LIMIT_UNIQUE_AMOUNT_BANK_ACCOUNT) {
                selected_bank_account = row_bank_account;
                break;
            }
        }

        // If no suitable bank account found, throw an error
        if (!selected_bank_account) {
            throw new Error('No suitable bank account available');
        }

        // Lock the selected bank account row
        plv8.execute(
            "SELECT * FROM bank_account WHERE id = $1 FOR UPDATE SKIP LOCKED",
            [selected_bank_account.id]
        );

        // Retrieve bank information
        const row_bank = plv8.execute(
            "SELECT * FROM bank WHERE id = $1 LIMIT 1",
            [selected_bank_account.bank_id]
        )[0];

        // Construct payment method
        const payment_method = 'bank_account_' + selected_bank_account.id;
        const instruction_type = 'ph_bank_transfer'
        const action_type = 'display_bank_transfer_instructions'

        const payment_tx_sum = plv8.execute(
            "SELECT SUM(amount) AS sum FROM payment_tx WHERE pi_id = $1 ",
            [row.id]
        )[0].sum || 0;

        const amount_remaining = (BigInt(row.amount) - BigInt(payment_tx_sum))+ BigInt(count_payment_intent.count)
        
        // Insert the memo code into bank_payment_memo
        const bank_payment_memo = plv8.execute(
            "INSERT INTO bank_payment_memo (ba_id, pi_id) " +
            "VALUES ($1, $2) " +
            "RETURNING code", // This returns the generated code
            [selected_bank_account.id, item.id]
        )[0];

        // Construct next action object
        const next_action = {
            type: action_type,
            [action_type]: {
                // Calculate remaining amount for bank transfer
                amount_remaining: amount_remaining,
                amount_remaining_e: row.amount_e,
                currency: row.currency,
                type: instruction_type,
                [instruction_type]: {
                    bank_code: row_bank.tag,
                    account_number: selected_bank_account.num,
                    memo: bank_payment_memo.code // Add a memo indicating the purpose of the transaction
                }
            }
        };

        // Update payment_intent table with new status, next action, and payment method
        plv8.execute(
            "UPDATE payment_intent SET " +
            "status = $1, next_action = $2 ," +
            "confirmation_method = 'automatic' ," +
            "payment_method = $3 " +
            "WHERE id = $4",
            [PAYMENT_INTENT_STATUS.REQUIRES_ACTION, next_action, payment_method, row.id]
        );

        // Update bank_account table with the timestamp of the last allocation
        plv8.execute(
            "UPDATE bank_account SET " +
            "last_allocated_at = NOW() " +
            "WHERE id = $1",
            [selected_bank_account.id]
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

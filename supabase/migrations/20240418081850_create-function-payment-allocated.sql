CREATE OR REPLACE FUNCTION public.allocate_payment_method_single(item payment_intent) RETURNS BOOLEAN AS $$
{
    // Retrieve payment intent and associated business account
    let row = plv8.execute(
        "SELECT pi.*, ba.org_id::TEXT AS org_id " +
        "FROM payment_intent pi " +
        "JOIN business_account ba ON ba.id = pi.account_id " +
        "WHERE pi.id = $1 AND pi.status = 'require_payment_method' " +
        "LIMIT 1 " +
        "FOR UPDATE SKIP LOCKED",
        [item.id]
    )[0];

    // If payment intent not found or not in the required state, return false
    if (!row) {
        return false;
    }

    // Retrieve bank account associated with business account
    let row_business_account = plv8.execute(
        "SELECT * FROM business_account WHERE id = $1 LIMIT 1",
        [row.account_id]
    )[0];

    // If business account not found, return false
    if (!row_business_account) {
        return false;
    }

    // Get available bank account
    let row_bank_account = plv8.execute(
        "SELECT ba.* " +
        "FROM bank_account ba " +
        "INNER JOIN bank b ON ba.bank_id = b.id " +
        "WHERE ba.org_id = $1 " +
        "ORDER BY ba.last_allocated_at DESC " +
        "LIMIT 1 " +
        "FOR UPDATE SKIP LOCKED",
        [row_business_account.org_id]
    )[0];

    // If bank account not found, return false
    if (!row_bank_account) {
        return false;
    }

    // Retrieve bank information
    let row_bank = plv8.execute(
        "SELECT * FROM bank WHERE id = $1 LIMIT 1",
        [row_bank_account.bank_id]
    )[0];

    // Construct payment method
    const payment_method = row_bank.tag + '_' + row_bank_account.id;

    // Update Price of in next_action
    let count_payment_intent = plv8.execute(
        "SELECT count(*) " +
        "FROM payment_intent pi " +
        "WHERE pi.amount = $1 AND pi.status = 'requires_action' AND pi.id != $2 AND payment_method = $3",
        [row.amount, item.id, payment_method]
    )[0];

    // Construct next action object
    const next_action = {
        display_bank_transfer: {
            // Calculate remaining amount for bank transfer
            amount_remaining: BigInt(row.amount) + BigInt(count_payment_intent.count),
            amount_remaining_e: 2,
            currency: row.currency,
            type: "ph_bank_transfer",
            ph_bank_transfer: {
                bank_code: row_bank.tag,
                account_number: row_bank_account.num,
                memo: "TODO: Memo" // Add a memo indicating the purpose of the transaction
            }
        }
    };

    // Update payment_intent table with new status, next action, and payment method
    plv8.execute(
        "UPDATE payment_intent SET " +
        "status = 'requires_action', next_action = $1 ," +
        "payment_method = $2 " +
        "WHERE id = $3",
        [next_action, payment_method, row.id]
    );

    // Update bank_account table with the timestamp of the last allocation
    plv8.execute(
        "UPDATE bank_account SET " +
        "last_allocated_at = NOW() " +
        "WHERE id = $1",
        [row_bank_account.id]
    );

    // Return true indicating successful allocation
    return true;
}
$$ LANGUAGE plv8 STRICT;

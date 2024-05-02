CREATE OR REPLACE FUNCTION private.update_succeeded_payment_intent(item public.bank_tx) RETURNS VOID AS $$
{
    // Check if the posted_at field is null, throw an error if it is
    if (item.posted_at === null) {
        plv8.elog(ERROR, 'This bank tx cannot be processed because posted_at is null.');
        return;
    }

    plv8.subtransaction(function() {
        const bpt = plv8.execute(
            "SELECT ptx FROM bank_payment_tx WHERE btx = $1",
            [item.id]
        );

        if (bpt.length === 0) {
            plv8.elog(ERROR, 'No bank_payment_tx found for the given bank_tx id.');
            return;
        }

        // Update payment transactions to succeeded
        bpt.forEach(function(entry) {
            plv8.execute(
                "UPDATE payment_tx SET status = 'succeeded' WHERE id = $1",
                [entry.ptx]
            );
        });

        // Fetch the associated payment intent that has not yet succeeded
        const payment_intent = plv8.execute(
            "SELECT * FROM payment_intent WHERE id = $1 AND status <> 'succeeded'",
            [bpt[0].ptx]  // Assuming bpt[0].ptx is the payment_intent id
        );

        if (payment_intent.length === 0) {
            plv8.elog(ERROR, 'No valid payment_intent found or it is already succeeded.');
            return;
        }

        // Sum the amount of all payment transactions
        const payment_tx_sum = plv8.execute(
            "SELECT sum(amount) as sum FROM payment_tx WHERE pi_id = $1",
            [bpt[0].ptx]  // Assuming the payment_tx is related to the payment_intent by pi_id
        )[0].sum;

        // Compare sum and update payment_intent status if conditions are met
        if (payment_tx_sum >= payment_intent[0].amount) {
            plv8.execute(
                "UPDATE payment_intent SET status = 'succeeded' WHERE id = $1",
                [payment_intent[0].id]
            );
        }
    });
}
$$ LANGUAGE plv8 STRICT;

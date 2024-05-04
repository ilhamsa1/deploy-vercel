CREATE OR REPLACE FUNCTION private.update_succeeded_payment_intent(item public.bank_tx) RETURNS VOID AS $$
{
    // Verify that posted_at is not null
    if (item.posted_at === null) {
        plv8.elog(ERROR, 'This bank transaction cannot be processed because posted_at is null.');
        return;
    }

    plv8.subtransaction(function() {
        // Retrieve bank payment transaction and associated payment transaction
        const bpt = plv8.execute(
            "SELECT pt.id as pt_id, pt.pi_id as pi_id FROM bank_payment_tx bpt JOIN payment_tx pt ON bpt.ptx = pt.id WHERE btx = $1",
            [item.id]
        );

        if (bpt.length === 0) {
            plv8.elog(ERROR, 'No bank_payment_tx found for the given bank_tx id.');
            return;
        }

        // Update payment transactions to 'succeeded'
        bpt.forEach(function(entry) {
            plv8.execute(
                "UPDATE payment_tx SET status = 'succeeded' WHERE id = $1",
                [entry.pt_id]
            );
        });

        // Assuming bpt[0].pi_id points to the correct payment_intent
        const payment_intent = plv8.execute(
            "SELECT * FROM payment_intent WHERE id = $1 AND status <> 'succeeded'",
            [bpt[0].pi_id]
        )[0];

        if (!payment_intent) {
            plv8.elog(ERROR, 'No valid payment_intent found or it is already succeeded.');
            return;
        }

        // Sum the amount of all related payment transactions
        const payment_tx_sum = plv8.execute(
            "SELECT SUM(amount) AS sum FROM payment_tx WHERE pi_id = $1 AND status = 'succeeded' ",
            [payment_intent.id]
        )[0].sum;

        // Compare sum and update payment_intent status if conditions are met
        if (payment_tx_sum >= payment_intent.amount) {
            plv8.execute(
                "UPDATE payment_intent SET status = 'succeeded' WHERE id = $1",
                [payment_intent.id]
            );
        }
    });
}
$$ LANGUAGE plv8 STRICT;

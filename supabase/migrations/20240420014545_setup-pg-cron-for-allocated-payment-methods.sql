create extension pg_cron with schema extensions;

select cron.schedule('scan-allocated-payment-method', '*/1 * * * *', 'CALL allocate_payment_methods()');


create extension if not exists pg_cron;

select
  cron.schedule(
    'scan-allocated-payment-method', 
    '* * * * *', 
    $$
    select allocate_payment_methods();
    $$
  );

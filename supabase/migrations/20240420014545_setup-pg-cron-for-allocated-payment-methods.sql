create extension if not exists pg_cron;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

select
  cron.schedule(
    'scan-allocated-payment-method', 
    '* * * * *', 
    $$
    select allocate_payment_methods();
    $$
  );

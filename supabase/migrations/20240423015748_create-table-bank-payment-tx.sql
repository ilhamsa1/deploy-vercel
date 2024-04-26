-- Create public.user_orgs table for storing user connected to organization
CREATE TABLE public.bank_payment_tx (
  ptx UUID NOT NULL REFERENCES "payment_tx" ON DELETE CASCADE,
  btx UUID NOT NULL REFERENCES "bank_tx" ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT pk_bank_payment_tx PRIMARY KEY(ptx, btx)
);

-- Enable RLS, we want to restrict access on this table
ALTER TABLE public.bank_payment_tx ENABLE ROW LEVEL SECURITY;

-- NOTIFY pgrst, 'reload schema';
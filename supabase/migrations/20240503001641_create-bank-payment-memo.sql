CREATE SEQUENCE public.bank_payment_memo_seq;

-- create a public.payment_tx table for storing payment transaction information
CREATE TABLE public.bank_payment_memo (
  -- id UUID_ULID NOT NULL DEFAULT uuid_generate_v7(),
  ba_id INTEGER NOT NULL REFERENCES bank_account ON DELETE CASCADE,
  pi_id UUID NOT NULL REFERENCES payment_intent ON DELETE CASCADE,
  seq BIGINT DEFAULT nextval('bank_payment_memo_seq'),
  code TEXT GENERATED ALWAYS AS (private.gen_memo_code(seq)) STORED,

  CONSTRAINT pk_bank_payment_memo PRIMARY KEY (pi_id, ba_id),
  
  CONSTRAINT uq_bank_payment_memo_ba_seq UNIQUE (ba_id, seq),
  CONSTRAINT uq_bank_payment_memo_ba_code UNIQUE (ba_id, code)
);
-- enable RLS, we want to restrict access on this table
ALTER TABLE public.bank_payment_memo ENABLE ROW LEVEL SECURITY;
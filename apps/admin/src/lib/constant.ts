export const PAYMENT_INTENT_STATUS = {
  CANCELED: 'canceled',
  PROCESSING: 'processing',
  REQUIRES_ACTION: 'requires_action',
  REQUIRES_CAPTURE: 'requires_capture',
  REQUIRES_CONFIRMATION: 'requires_confirmation',
  REQUIRES_PAYMENT_METHOD: 'requires_payment_method',
  SUCCEEDED: 'succeeded',
}

interface AmountCurrency {
  [key: string]: { currency: string; fractionDigits: number }
}

export const amountCurrency: AmountCurrency = {
  php: { currency: 'PHP', fractionDigits: 2 },
  usd: { currency: 'USD', fractionDigits: 2 },
}

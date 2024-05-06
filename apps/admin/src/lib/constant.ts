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

type EventType = {
  type: string
  description: string
}

type Event = {
  key: string
  title: string
  event_types: EventType[]
}

export const EVENTS: Event[] = [
  {
    key: 'payment_intent',
    title: 'payment intent',
    event_types: [
      {
        type: 'amount_capturable_updated',
        description:
          'Occurs when a PaymentIntent has funds to be captured. Check the amount_capturable property on the PaymentIntent to determine the amount that can be captured. You may capture the PaymentIntent with an amount_to_capture value up to the specified amount.',
      },
      {
        type: 'canceled',
        description: 'Occurs when a PaymentIntent is canceled.',
      },
      {
        type: 'created',
        description: 'Occurs when a new PaymentIntent is created.',
      },
      {
        type: 'partially_funded',
        description:
          'Occurs when funds are applied to a customer_balance PaymentIntent and the ‘amount_remaining’ changes.',
      },
      {
        type: 'payment_failed',
        description:
          'Occurs when a PaymentIntent has failed the attempt to create a payment method or a payment.',
      },
      {
        type: 'processing',
        description: 'Occurs when a PaymentIntent has started processing.',
      },
      {
        type: 'requires_action',
        description: 'Occurs when a PaymentIntent transitions to requires_action state.',
      },
      {
        type: 'succeeded',
        description: 'Occurs when a PaymentIntent has successfully completed payment.',
      },
    ],
  },
  {
    key: 'payout',
    title: 'Payout',
    event_types: [
      {
        type: 'created',
        description: 'Occurs whenever a payout is created.',
      },
    ],
  },
]

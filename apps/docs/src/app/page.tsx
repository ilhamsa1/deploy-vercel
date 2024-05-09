'use client'

import React, { useState } from 'react'
import CreatePayment from './components/step/create-payment'
import WaitForPayment from './components/step/wait-for-payment'
import AskCustomerToTakeAction from './components/step/ask-customer-take-action'
import WaitForProcessingEvent from './components/step/wait-processing-event'
import WaitForSucceededEvent from './components/step/wait-succeeded-event'
import PaymentCompleted from './components/step/payment-completed'

// Define constants for steps
enum Steps {
  CREATE_PAYMENT = 0,
  WAIT_FOR_PAYMENT,
  CUSTOMER_ACTION,
  PROCESSING_EVENT,
  SUCCEEDED_EVENT,
  COMPLETED,
}

export default function Index() {
  const [apiKey, setApiKey] = useState<string>('')
  const [step, setStep] = useState<Steps>(Steps.CREATE_PAYMENT)
  const [paymentId, setPaymentId] = useState<string>('')

  const advanceStep = (nextStep: Steps, delay = 0): void => {
    setTimeout(() => {
      setStep(nextStep)
    }, delay)
  }

  switch (step) {
    case Steps.CREATE_PAYMENT:
      return (
        <CreatePayment
          onCreate={(result: { id?: string }) => {
            setPaymentId(result?.id || '')
          }}
          setApiKey={setApiKey}
          apiKey={apiKey}
          onNext={() => {
            advanceStep(Steps.WAIT_FOR_PAYMENT, 0)
          }}
        />
      )

    case Steps.WAIT_FOR_PAYMENT:
      return (
        <WaitForPayment
          paymentId={paymentId}
          apiKey={apiKey}
          onNext={() => advanceStep(Steps.CUSTOMER_ACTION)}
        />
      )

    case Steps.CUSTOMER_ACTION:
      return (
        <AskCustomerToTakeAction
          paymentId={paymentId}
          apiKey={apiKey}
          onNext={() => setStep(Steps.PROCESSING_EVENT)}
        />
      )

    case Steps.PROCESSING_EVENT:
      return (
        <WaitForProcessingEvent
          paymentId={paymentId}
          apiKey={apiKey}
          onNext={() => advanceStep(Steps.SUCCEEDED_EVENT)}
        />
      )

    case Steps.SUCCEEDED_EVENT:
      return (
        <WaitForSucceededEvent
          paymentId={paymentId}
          apiKey={apiKey}
          onNext={() => setStep(Steps.COMPLETED)}
        />
      )

    case Steps.COMPLETED:
      return (
        <PaymentCompleted
          onReset={() => {
            setPaymentId('')
            // setApiKey('')
            setStep(Steps.CREATE_PAYMENT)
          }}
        />
      )

    default:
      return <div>Invalid step</div>
  }
}

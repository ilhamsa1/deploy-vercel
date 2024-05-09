import React from 'react'
import Lottie from 'react-lottie'

export default function PaymentAnimation({
  isStop,
  onComplete,
  data,
  autoplay = false,
}: {
  isStop: boolean
  onComplete: any
  data: any
  autoplay?: boolean
}) {
  return (
    <Lottie
      options={{
        loop: false,
        autoplay,
        animationData: data,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
      isStopped={isStop}
      isPaused={false}
      eventListeners={[
        {
          eventName: 'complete',
          callback: onComplete,
        },
      ]}
    />
  )
}

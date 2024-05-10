/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Container, Stack, Typography, Box, CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import api from '../../../services/api'
import Payload from '../payload'
import { useQuery } from '@tanstack/react-query'
import { green } from '@mui/material/colors'
import * as animationData from '../lottie/4.json'
import PaymentAnimation from '../lottie'

interface WaitForProcessingEventProps {
  paymentId: string
  apiKey: string
  onNext: () => void // More specific type for updates.
}

const WaitForProcessingEvent: React.FC<WaitForProcessingEventProps> = ({
  paymentId,
  apiKey,
  onNext,
}) => {
  const [isAnimationStart, setIsAnimationStart] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const { isLoading, error, data } = useQuery({
    queryKey: ['payment_intent_status'],
    queryFn: async () => {
      const response = await api.get(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )
      return (response.data as any).data
    },
  })

  useEffect(() => {
    if (data?.status === 'processing') {
      // Assuming status is part of the returned data object
      setTimeout(() => {
        setCanNext(true)
      }, 5000) // Fire onNext after a delay if the condition is met
    }
  }, [data, onNext])

  if (isLoading) return <CircularProgress />

  if (error) return <Typography color="error">Error: {error.message}</Typography>

  return (
    <Container
      maxWidth="md"
      sx={{ marginTop: 4, marginBottom: 4 }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'medium', color: green[800] }}
        >
          Wait for Payment Processing Event
        </Typography>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={!canNext}
          sx={{ bgcolor: green[400], '&:hover': { bgcolor: green[500] } }}
        >
          Next
        </Button>
      </Box>
      <Stack spacing={2}>
        <Typography variant="h6">Listen for Event via Realtime</Typography>
        <Typography variant="body2">
          List events, going back up to 30 days. Each event data is rendered according to Stripe API
          version at its creation time, specified in the event object api_version attribute (not
          according to your current Stripe API version or Stripe-Version header).
        </Typography>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            width: '100%',
            minHeight: 200,
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 1,
          }}
        >
          <PaymentAnimation
            data={animationData}
            isStop={isAnimationStart}
            onComplete={() => {
              console.log('done')
            }}
          />
        </Box>
        <Payload jsonData={data} />
      </Stack>
    </Container>
  )
}

export default WaitForProcessingEvent

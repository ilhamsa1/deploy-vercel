import React, { useEffect } from 'react'
import { Container, Stack, Typography, Box, CircularProgress, useTheme } from '@mui/material'
import api from '../../../services/api'
import Payload from '../payload'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { green } from '@mui/material/colors'

interface WaitForProcessingEventProps {
  paymentId: string
  apiKey: string
  onNext: (update: { status: string }) => void // More specific type for updates.
}

const WaitForProcessingEvent: React.FC<WaitForProcessingEventProps> = ({
  paymentId,
  apiKey,
  onNext,
}) => {
  const supabase = createClient()
  const theme = useTheme()

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
      return response.data
    },
  })

  useEffect(() => {
    const handleUpdate = (response: { new: { status: string } }) => {
      if (response.new.status === 'succeeded') {
        setTimeout(() => onNext(response.new), 3000)
      }
    }

    supabase
      .channel('payment_intent')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'payment_intent' },
        handleUpdate,
      )
      .subscribe()

    // return () => subscription.unsubscribe()
  }, [onNext, paymentId, supabase])

  if (isLoading) return <CircularProgress />

  if (error) return <Typography color="error">Error: {error.message}</Typography>

  return (
    <Container
      maxWidth="md"
      sx={{ marginTop: 4, marginBottom: 4 }}
    >
      <Typography
        variant="h4"
        sx={{ color: green[700], marginBottom: 2 }}
      >
        Wait for Payment Processing Event
      </Typography>
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
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            Processing...
          </Typography>
        </Box>
        <Payload jsonData={data} />
      </Stack>
    </Container>
  )
}

export default WaitForProcessingEvent

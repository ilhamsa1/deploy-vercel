import React, { useEffect } from 'react'
import { Container, Stack, Typography, Box, CircularProgress } from '@mui/material'
import api from '../../../services/api'
import Payload from '../payload'
import { useQuery } from '@tanstack/react-query'
import { green } from '@mui/material/colors'

interface WaitForSucceededEventProps {
  paymentId: string
  apiKey: string
  onNext: () => void // Assuming onNext does not need any parameters, adjust if necessary
}

const WaitForSucceededEvent: React.FC<WaitForSucceededEventProps> = ({
  paymentId,
  apiKey,
  onNext,
}) => {
  const { isLoading, error, data } = useQuery<any, Error>({
    queryKey: ['payment_intent_success', paymentId], // Make the key more specific to this event
    queryFn: async () => {
      const response = await api.get(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )
      return response.data.data
    },
  })

  useEffect(() => {
    if (data?.status === 'succeeded') {
      // Assuming status is part of the returned data object
      setTimeout(onNext, 5000) // Fire onNext after a delay if the condition is met
    }
  }, [data, onNext])

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ textAlign: 'center' }}
      >
        Error: {error.message}
      </Typography>
    )
  }

  return (
    <Container
      maxWidth="md"
      sx={{ marginTop: 4, marginBottom: 4 }}
    >
      <Typography
        variant="h4"
        sx={{ marginBottom: 2, color: green[700], }}
      >
        Wait for Payment Succeeded Event
      </Typography>
      <Stack spacing={2}>
        <Box
          sx={{
            bgcolor: 'background.paper',
            width: '100%',
            minHeight: 200,
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 1,
          }}
        >
          <Typography sx={{ color: 'text.secondary' }}>Processing...</Typography>
        </Box>
        <Payload jsonData={data} />
      </Stack>
    </Container>
  )
}

export default WaitForSucceededEvent

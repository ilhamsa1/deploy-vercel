import React, { useEffect, useState } from 'react'
import { Container, Stack, Typography, Box, CircularProgress } from '@mui/material'
import Button from '@mui/material/Button'
import api from '../../../services/api'
import Payload from '../payload'
import { useQuery } from '@tanstack/react-query'
import { green } from '@mui/material/colors'
import * as animationData from '../lottie/5.json'
import PaymentAnimation from '../lottie'

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
  const [isAnimationStart, setIsAnimationStart] = useState(false)
  const [canNext, setCanNext] = useState(false)

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
      setTimeout(() => {
        setCanNext(true)
      }, 5000) // Fire onNext after a delay if the condition is met
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
          Wait for Payment Succeeded Event
        </Typography>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={!canNext}
          sx={{ bgcolor: green[400], '&:hover': { bgcolor: green[500] } }}
        >
          Complete
        </Button>
      </Box>
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

export default WaitForSucceededEvent

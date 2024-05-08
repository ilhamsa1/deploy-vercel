import React, { useEffect } from 'react'
import { Container, Stack, Typography, Button, Box, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import api from '../../../services/api'
import Payload from '../payload'
import { green, grey } from '@mui/material/colors'

interface WaitForPaymentProps {
  paymentId: string
  apiKey: string
  onNext: () => void
}

const WaitForPayment = ({ paymentId, apiKey, onNext }: WaitForPaymentProps) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['payment'],
    queryFn: async () => {
      const result = await api.get(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )

      return result.data
    },
  })

  useEffect(() => {
    if (data) {
      onNext()
    }
  }, [data, onNext])

  return (
    <Container
      maxWidth="md"
      sx={{ my: 4 }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 'medium', color: green[800] }}
      >
        Wait for Payment Instructions
      </Typography>
      <Stack spacing={3}>
        {isLoading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            <Box
              sx={{
                bgcolor: grey[100],
                width: '100%',
                height: 200,
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ color: grey[800] }}
              >
                Process Details
              </Typography>
            </Box>
            <Payload jsonData={data} />
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default WaitForPayment

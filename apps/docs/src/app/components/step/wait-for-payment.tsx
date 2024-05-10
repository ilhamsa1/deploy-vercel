import React, { useState } from 'react'
import { Container, Stack, Typography, Button, Box, CircularProgress } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import api from '../../../services/api'
import Payload from '../payload'
import { green, grey } from '@mui/material/colors'
import * as animationData from '../lottie/2.json'
import PaymentAnimation from '../lottie'

interface WaitForPaymentProps {
  paymentId: string
  apiKey: string
  onNext: () => void
}

const WaitForPayment = ({ paymentId, apiKey, onNext }: WaitForPaymentProps) => {
  const [isAnimationStart] = useState(false)
  const { isLoading, data } = useQuery({
    queryKey: ['payment'],
    queryFn: async () => {
      const result = await api.get(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )

      return (result.data as any).data
    },
  })

  // useEffect(() => {
  //   if (data) {
  //     onNext()
  //   }
  // }, [data, onNext])

  return (
    <Container
      maxWidth="md"
      sx={{ my: 4 }}
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
          Wait for Payment Instructions
        </Typography>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={!data}
          sx={{ bgcolor: green[400], '&:hover': { bgcolor: green[500] } }}
        >
          Next
        </Button>
      </Box>
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
        )}
      </Stack>
    </Container>
  )
}

export default WaitForPayment

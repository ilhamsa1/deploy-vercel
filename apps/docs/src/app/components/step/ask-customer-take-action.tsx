import React, { useEffect, useState } from 'react'
import { Container, Button, Stack, Typography, Box, CircularProgress } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import api from '../../../services/api'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

import * as animationDataA from '../lottie/3a.json'
import * as animationDataB from '../lottie/3b.json'
import PaymentAnimation from '../lottie'

// Define TypeScript interfaces or types
interface AskCustomerProps {
  paymentId: string
  apiKey: string
  onNext: (newData: any) => void // Define a proper type based on what onNext actually expects
}

// interface PaymentIntent {
//   data: {
//     next_action: {
//       display_bank_transfer_instructions: {
//         type: string
//         [key: string]: BankDetails
//       }
//     }
//   }
// }

const changeCentToPrice = (value: string): string => {
  const numberValue = parseFloat(value.replace(/[$,]/g, '')) / 100
  if (!isNaN(numberValue)) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      currencyDisplay: 'code',
    })
    return formatter.format(numberValue)
  }
  return '0'
}

const AskCustomerToTakeAction: React.FC<AskCustomerProps> = ({ paymentId, apiKey, onNext }) => {
  const supabase = createClient()
  const [canNext, setCanNext] = useState(false)
  const { isLoading, error, data } = useQuery({
    queryKey: ['paymentDetails'],
    queryFn: async () => {
      const response = await api.get(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )
      return (response?.data as any).data as any
    },
  })

  useEffect(() => {
    const handleUpdate = (response: any) => {
      // This should also be typed based on your real-time system structure
      const paymentAmount = data?.next_action.display_bank_transfer_instructions.amount_remaining
      const responseAmount =
        response?.new.next_action.display_bank_transfer_instructions.amount_remaining
      if (responseAmount === paymentAmount && response?.new.status === 'processing') {
        setTimeout(() => {
          setCanNext(true)
          // onNext(response.new)
        }, 3000)
      }
    }
    if (data) {
      supabase
        .channel('payment_intent')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'payment_intent' },
          handleUpdate,
        )
        .subscribe()
    }
  }, [data, onNext, supabase])

  if (isLoading) return <CircularProgress />

  if (error) return <Typography color="error">Error: {error.message}</Typography>

  const instructions = data?.next_action.display_bank_transfer_instructions
  const type = instructions?.type
  const bankDetails = instructions && instructions[type]

  return (
    <Container
      maxWidth="md"
      sx={{ my: 4, bgcolor: grey[100], p: 3, borderRadius: 2, boxShadow: 1 }}
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
          Ask Customer to take action
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
      <Stack spacing={3}>
        <Typography
          variant="body2"
          fontWeight="bold"
        >
          Display Bank Transfer Instructions:
        </Typography>
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
          <Stack
            direction="row"
            spacing={2}
            divider={<Box sx={{ width: 2, bgcolor: grey[300] }} />}
          >
            <Box sx={{ flex: 1 }}>
              <Typography>Bank Account Number:</Typography>
              <Typography>Nominal:</Typography>
              <Typography>Memo:</Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography>
                {bankDetails?.bank_code} {bankDetails?.account_number}
              </Typography>
              <Typography>{changeCentToPrice(String(instructions?.amount_remaining))}</Typography>
              <Typography>{bankDetails?.memo}</Typography>
            </Box>
          </Stack>
        </Box>
        <Typography
          variant="body2"
          fontWeight="bold"
        >
          Wait for customer to perform the Bank Transfer:
        </Typography>
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
          <PaymentAnimation
            data={animationDataA}
            isStop={false}
            onComplete={() => {
              console.log('done')
            }}
          />
        </Box>
        <Typography
          variant="body2"
          fontWeight="bold"
        >
          {"Wait for Fund Transfer / Transaction to arrive (in Lexupay's bank account)"}
        </Typography>
        <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1 }}>
          <PaymentAnimation
            data={animationDataB}
            isStop={false}
            onComplete={() => {
              console.log('done')
            }}
          />
        </Box>
      </Stack>
    </Container>
  )
}

export default AskCustomerToTakeAction

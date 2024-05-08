import React, { useEffect } from 'react'
import { Container, Stack, Typography, Box, CircularProgress } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import api from '../../../services/api'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'

// Define TypeScript interfaces or types
interface AskCustomerProps {
  paymentId: string
  apiKey: string
  onNext: (newData: any) => void // Define a proper type based on what onNext actually expects
}

interface BankDetails {
  bank_code: string
  account_number: string
  amount_remaining: number
  memo: string
}

interface PaymentIntent {
  data: {
    next_action: {
      display_bank_transfer_instructions: {
        type: string
        [key: string]: BankDetails
      }
    }
  }
}

const changeCentToPrice = (value: string): string => {
  const numberValue = parseFloat(value.replace(/[\$,]/g, '')) / 100
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

  const { isLoading, error, data } = useQuery({
    queryKey: ['paymentDetails'],
    queryFn: async () => {
      const response = await api.get<PaymentIntent>(
        `/payment_intent/${paymentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )
      return response?.data?.data
    },
  })

  useEffect(() => {
    const handleUpdate = (response: any) => {
      // This should also be typed based on your real-time system structure
      const paymentAmount = data?.next_action.display_bank_transfer_instructions.amount_remaining
      const responseAmount = response?.new.next_action.display_bank_transfer_instructions.amount_remaining
      if (responseAmount === paymentAmount && response?.new.status === 'processing') {
        setTimeout(() => {
          onNext(response.new)
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
      <Typography
        variant="h4"
        sx={{ mb: 2, color: green[700] }}
      >
        Ask Customer to take action
      </Typography>
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
          <Typography>Processing...</Typography>
        </Box>
      </Stack>
    </Container>
  )
}

export default AskCustomerToTakeAction

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Stack, Typography, TextField, Button, Box } from '@mui/material'
import api from '../../../services/api'
import Payload from '../payload'
import { green, grey } from '@mui/material/colors'

// Define a schema for the form data using Zod
const formSchema = z.object({
  apiKey: z.string().min(1, 'Api Key is required'),
  amount: z.string().min(1, 'Amount must not be empty'), // Validating that amount is not empty
})

type FormData = z.infer<typeof formSchema>

export default function CreatePayment({
  onCreate,
  setApiKey,
  apiKey,
  onNext, // Added onNext prop
}: {
  onCreate: (data: any) => void // Define a proper type for `data`
  setApiKey: (key: string) => void
  apiKey: string
  onNext: () => void // Function to handle the next step
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })
  const [response, setResponse] = useState({})

  const onSubmit = async (data: FormData) => {
    try {
      const result = await api.post(
        '/payment_intent',
        { amount: data.amount, currency: 'php' },
        { headers: { Authorization: `Bearer ${data.apiKey}` } },
      )
      setResponse(result?.data.data)
      if (result) {
        onCreate(result?.data.data) // Assuming onCreate expects the data directly
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

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
          Create Payment for Customer
        </Typography>
        <Button
          onClick={onNext}
          variant="contained"
          disabled={!response?.id}
          sx={{ bgcolor: green[400], '&:hover': { bgcolor: green[500] } }}
        >
          Next Step
        </Button>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <TextField
            size="small"
            label="API Key"
            {...register('apiKey')}
            error={!!errors.apiKey}
            helperText={errors.apiKey?.message}
            defaultValue={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            sx={{ width: '100%', '.MuiInputBase-root': { bgcolor: grey[50] } }}
          />
          <TextField
            size="small"
            label="Input Amount"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            sx={{ width: '100%', '.MuiInputBase-root': { bgcolor: grey[50] } }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: green[600], '&:hover': { bgcolor: green[700] } }}
          >
            Create
          </Button>
          <Box sx={{ bgcolor: grey[100], width: '100%', height: 200, p: 2, borderRadius: 2 }}>
            <Typography sx={{ color: grey[800] }}>Process</Typography>
          </Box>
          <Payload jsonData={response} />
        </Stack>
      </form>
    </Container>
  )
}

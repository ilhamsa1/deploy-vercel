import React from 'react'
import { Button, Container, Stack, Typography, Box } from '@mui/material'
import { green } from '@mui/material/colors'
import * as animationData from '../lottie/success.json'
import Lottie from '../lottie'

interface PaymentCompletedProps {
  onReset: () => void
}

const PaymentCompleted: React.FC<PaymentCompletedProps> = ({ onReset }) => {
  return (
    <Container
      maxWidth="md"
      sx={{
        my: 4,
        display: 'flex', // Ensures flex container
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        height: '80vh', // Take full view height to center vertically
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          color: green[500],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
        >
          Payment Completed
        </Typography>
      </Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, maxWidth: 600 }}
      >
        Your transaction has been processed successfully. You may continue using our services or
        perform another operation.
      </Typography>
      <Box sx={{ maxWidth: 200, mb: 2 }}>
        <Lottie
          data={animationData}
          isStop={false}
          onComplete={() => {
            console.log('')
          }}
          autoplay={true}
        />
      </Box>
      <Stack
        spacing={2}
        direction="column"
        alignItems="center"
      >
        <Button
          variant="contained"
          sx={{ bgcolor: green[600], '&:hover': { bgcolor: green[700] } }}
          onClick={onReset}
        >
          Make Another Payment
        </Button>
      </Stack>
    </Container>
  )
}

export default PaymentCompleted

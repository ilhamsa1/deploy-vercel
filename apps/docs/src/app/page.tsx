'use client'

import { Stack, Container, Typography, TextField, Button, Box } from '@mui/material'
const data = {
  id: '01HX0TBJVPEXJAAG55N0677HY7',
};
export default function Index() {
  return (
    <Container
      maxWidth="md"
      sx={{ my: 4 }}
    >
      <Typography variant="h4">Create Payment for Customer</Typography>
      <Stack
        sx={{ my: 4 }}
        spacing={2}
      >
        <Stack spacing={2}>
          <TextField
            size="small"
            name="apiKey"
            label="Api key"
          />
          <TextField
            size="small"
            name="amount"
            label="Input Amount"
          />
          <Button variant="contained">Create</Button>
        </Stack>
        <Stack sx={{ bgcolor: '#fff', width: '100%', height: 200, p: 2 }}>Process</Stack>
        <Stack sx={{ bgcolor: '#fff', width: '100%', height: 200, p: 2 }}>
          <Typography variant="h6">Response</Typography>
          <Box sx={{ p: 1, bgcolor: '#bbb' }}>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </Box>
        </Stack>
      </Stack>
    </Container>
  )
}

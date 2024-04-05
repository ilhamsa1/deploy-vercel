import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Transactions',
}

export default async function TransactionPage() {
  return (
    <Box>
      <Box>
        <Typography>Transactions</Typography>
      </Box>
    </Box>
  )
}

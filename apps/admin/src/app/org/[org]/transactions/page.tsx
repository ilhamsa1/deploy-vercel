import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

import TransactionList from './_components/list'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Transactions',
}

export default async function TransactionPage() {
  return (
    <Box>
      <Box>
        <Typography variant="h3">Transactions</Typography>
      </Box>
      <TransactionList />
    </Box>
  )
}

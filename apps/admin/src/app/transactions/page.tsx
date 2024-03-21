import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

import { auth } from '../../config/auth'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Transactions',
}

export default async function TransactionPage() {
  const session = await auth()

  return (
    <Box>
      <Box>
        <Typography>Transactions</Typography>
        <Typography>Hi {session?.user?.name}!</Typography>
      </Box>
    </Box>
  )
}

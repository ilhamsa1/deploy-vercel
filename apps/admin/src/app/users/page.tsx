import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

import { auth } from '../../config/auth'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage() {
  const session = await auth()

  return (
    <Box>
      <Box>
        <Typography>Users</Typography>
        <Typography>Hi {session?.user?.name}!</Typography>
      </Box>
    </Box>
  )
}

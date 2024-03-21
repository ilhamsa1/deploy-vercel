import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

import { auth } from '../config/auth'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
  description: 'Admin dashboard to luxe systems',
}

export default async function Index() {
  const session = await auth()

  return (
    <Box>
      <Box>
        <Typography>Hi {session?.user?.name}!</Typography>
      </Box>
    </Box>
  )
}

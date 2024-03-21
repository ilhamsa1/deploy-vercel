import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

import { auth } from '../../config/auth'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Profile',
}

export default async function ProfilePage() {
  const session = await auth()

  return (
    <Box>
      <Box>
        <Typography>Profile</Typography>
        <Typography>Hi {session?.user?.name}!</Typography>
      </Box>
    </Box>
  )
}

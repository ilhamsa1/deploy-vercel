import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Profile',
}

export default async function ProfilePage() {
  return (
    <Box>
      <Box>
        <Typography>Profile</Typography>
      </Box>
    </Box>
  )
}

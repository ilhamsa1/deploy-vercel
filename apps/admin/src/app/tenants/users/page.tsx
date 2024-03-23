import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage() {
  return (
    <Box>
      <Box>
        <Typography>Users</Typography>
      </Box>
    </Box>
  )
}

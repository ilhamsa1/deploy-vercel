import type { Metadata } from 'next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Tabs from './_components/tabs'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage() {
  return (
    <Box>
      <Box>
        <Typography variant="h3">Users</Typography>
      </Box>
      <Tabs />
    </Box>
  )
}

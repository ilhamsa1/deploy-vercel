'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Tabs from './components/tabs'

export default async function UsersContent() {
  return (
    <Box>
      <Box>
        <Typography variant="h3">Users</Typography>
      </Box>
      <Tabs />
    </Box>
  )
}

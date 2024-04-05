import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function TenantsPage() {
  return (
    <Box>
      <Box>
        <Typography>Tenant</Typography>
      </Box>
    </Box>
  )
}

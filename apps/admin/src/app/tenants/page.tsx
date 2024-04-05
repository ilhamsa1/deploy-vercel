import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { getOrganizationById } from '@/models/organizations/queries'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function TenantsPage() {
  const client = createClient()
  const data = await getOrganizationById(client, 1)

  return (
    <Box>
      <Box>
        <Typography>Dashboard</Typography>
        {JSON.stringify(data)}
      </Box>
    </Box>
  )
}

import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getUserAuth } from '@/models/organizations/actions'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function OrgPage() {
  const data = await getUserAuth()

  if (!data) {
    redirect('/org')
  }

  return (
    <Box>
      <Box>
        <Typography>Dashboard</Typography>
        {JSON.stringify(data)}
      </Box>
    </Box>
  )
}

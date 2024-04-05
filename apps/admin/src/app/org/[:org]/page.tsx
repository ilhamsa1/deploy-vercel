import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata, NextPage } from 'next'
import { getUserOrganizationByUser } from '@/models/user/queries'
import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

interface PageProps {
  params: { org: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TenantsPage({ params }: PageProps) {
  // const client = createClient()

  return (
    <Box>
      <Box>
        <Typography>Dashboard</Typography>
        {JSON.stringify(params.org)}
      </Box>
    </Box>
  )
}

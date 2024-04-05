import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'
import { getOrganizationByTagName } from '@/models/organizations/queries'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

interface PageProps {
  params: { org: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function TenantsPage({ params }: PageProps) {
  const client = createClient()
  const data = await getOrganizationByTagName(client, params.org)

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

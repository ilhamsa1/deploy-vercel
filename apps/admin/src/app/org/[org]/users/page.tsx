import type { Metadata } from 'next'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { createClient } from '@/utils/supabase/server'
import { getUserList } from '@/models/user/queries'

import Tabs from './_components/tabs'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage({ params }: { params: { org: string } }) {
  const client = createClient()
  const users = await getUserList(client, params.org)

  return (
    <Box>
      <Box>
        <Typography variant="h3">Users</Typography>
      </Box>
      <Tabs
        users={users.data || []}
        count={users.count || 0}
      />
    </Box>
  )
}

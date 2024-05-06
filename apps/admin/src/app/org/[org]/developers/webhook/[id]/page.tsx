import Box from '@mui/material/Box'

import { getUserAuth } from '@/models/organizations/actions'
import { redirect } from 'next/navigation'

export default async function DevelopersPage() {
  const data = await getUserAuth()

  if (!data) {
    redirect('/org')
  }

  return (
    <Box>
      <span>test</span>
    </Box>
  )
}

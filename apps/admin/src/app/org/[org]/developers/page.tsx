import Box from '@mui/material/Box'

import Tabs from './_components/tabs'
import { getUserAuth } from '@/models/organizations/actions'
import { redirect } from 'next/navigation'

export default async function DevelopersPage() {
  const data = await getUserAuth()

  if (!data) {
    redirect('/org')
  }

  return <Box>{data?.user && <Tabs user={data?.user} />}</Box>
}

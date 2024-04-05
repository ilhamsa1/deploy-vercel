import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'
import WrapperProvider from '../wrapper'
import { getSingleUserOrganizationByUser } from '@/models/user/queries'

export default async function SessionProvider({
  children,
  org,
}: {
  children: React.ReactNode
  org?: string
}) {
  const supabase = createClient()

  const { userData } = await getSingleUserOrganizationByUser(supabase)
  if (!userData?.user) {
    redirect('/login')
  }

  return (
    <WrapperProvider
      user={userData?.user}
      prefixUrl={`/org/${org}`}
    >
      {children}
    </WrapperProvider>
  )
}

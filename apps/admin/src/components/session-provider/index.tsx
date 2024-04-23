import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'
import WrapperProvider from '../wrapper'

export default async function SessionProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData?.user) {
    redirect('/login')
  }

  if (!userData?.user?.user_metadata?.org?.id) {
    // choose org
    redirect('/org')
  }

  return <WrapperProvider user={userData?.user}>{children}</WrapperProvider>
}

import React from 'react'
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'
import WrapperProvider from '../wrapper'

export default async function SessionProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <WrapperProvider user={data?.user}>{children}</WrapperProvider>
}

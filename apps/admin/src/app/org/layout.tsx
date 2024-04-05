import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import SharedProvider from '@/components/shared-provider'

export const metadata: Metadata = {
  title: 'Luxe',
}

export default async function TenantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return <SharedProvider>{children}</SharedProvider>
}

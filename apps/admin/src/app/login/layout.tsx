import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import SharedProvider from '../../components/shared-provider'

import { createClient } from '../../utils/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe Login',
}

export default async function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (data?.user) {
    redirect('/org')
  }
  return (
    <SharedProvider>
      {children}
      <Toaster />
    </SharedProvider>
  )
}

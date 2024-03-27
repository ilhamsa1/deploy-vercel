import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import { createClient } from '../../utils/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe Login',
}

export default async function TenantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data } = await supabase.auth.getUser()
  if (data?.user) {
    redirect('/tenants')
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

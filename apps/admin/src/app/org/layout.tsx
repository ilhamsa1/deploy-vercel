import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export const metadata: Metadata = {
  title: 'Luxe',
}

export default async function OrgLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return children
}

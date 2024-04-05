import React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

import SharedProvider from '../../components/shared-provider'

import { createClient } from '../../utils/supabase/server'
import { getUserOrganizationByUser } from '@/models/user/queries'

export const metadata: Metadata = {
  title: 'Luxe Login',
}

export default async function TenantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { userData, userOrg } = await getUserOrganizationByUser(supabase)
  if (userData?.user) {
    // Note: will fix leter, TypeScript assumes 'org' is an array but it is actually an object
    const tag = (userOrg?.org as any)?.tag
    redirect(`/org/${tag}`)
  }

  return (
    <SharedProvider>
      {children}
      <Toaster />
    </SharedProvider>
  )
}

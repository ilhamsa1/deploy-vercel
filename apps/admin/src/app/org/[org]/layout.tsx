import React from 'react'
import type { Metadata } from 'next'

import SessionProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'Luxe',
}

interface Props {
  children: React.ReactNode
  params: {
    org: string
  }
}

export default function TenantsLayout({
  children, // will be a page or nested layout
  params,
}: Props) {
  return <SessionProvider org={params.org}>{children}</SessionProvider>
}

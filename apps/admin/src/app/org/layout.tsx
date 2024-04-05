import React from 'react'
import type { Metadata } from 'next'

import SessionProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'Luxe',
}

export default function TenantsLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return <SessionProvider>{children}</SessionProvider>
}

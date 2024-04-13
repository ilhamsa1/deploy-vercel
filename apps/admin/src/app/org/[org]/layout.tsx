import React from 'react'
import type { Metadata } from 'next'

import SessionProvider from '@/components/session-provider'

export const metadata: Metadata = {
  title: 'Luxe',
}

interface Props {
  children: React.ReactNode
}

export default function OrgLayout({
  children, // will be a page or nested layout
}: Props) {
  return <SessionProvider>{children}</SessionProvider>
}

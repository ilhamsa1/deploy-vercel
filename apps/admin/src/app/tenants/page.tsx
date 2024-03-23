import type { Metadata } from 'next'

import SessionProvider from '../../components/session-provider'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function TenantsPage({ children }: any) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

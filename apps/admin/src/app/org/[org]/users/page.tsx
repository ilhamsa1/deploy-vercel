import type { Metadata } from 'next'

import UsersContent from '@/components/user'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage() {
  return <UsersContent />
}

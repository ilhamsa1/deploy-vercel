import type { Metadata } from 'next'

import UsersContent from '../../_components/users/page-view'

export const metadata: Metadata = {
  title: 'Luxe Dashboard | Users',
}

export default async function UsersPage() {
  return <UsersContent />
}

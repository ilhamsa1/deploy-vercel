import React from 'react'
import type { Metadata } from 'next'
import OrgUserList from './_components/org-user-list/page-view'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function TenantsPage() {
  return <OrgUserList />
}

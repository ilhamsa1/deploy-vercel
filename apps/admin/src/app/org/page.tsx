import React from 'react'
import type { Metadata } from 'next'

import { getUserOrganizationListByUser } from '@/models/organizations/actions'
import OrgUserList from './_components/org-user-list/page-view'
import OrgUserNotFound from './_components/org-user-not-found/page-view'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function OrgsPage() {
  const data = await getUserOrganizationListByUser()
  if (!data?.length) return <OrgUserNotFound />
  return <OrgUserList data={data} />
}

import React from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'

import OrgUserList from './_components/org-user-list/page-view'
import { getUserOrganizationListByUser } from '@/models/user/queries'
import OrgUserNotFound from './_components/org-user-not-found/page-view'

export const metadata: Metadata = {
  title: 'Luxe Dashboard',
}

export default async function TenantsPage() {
  const client = createClient()

  const data = await getUserOrganizationListByUser(client)
  if (!data?.length) return <OrgUserNotFound />
  return <OrgUserList data={data} />
}

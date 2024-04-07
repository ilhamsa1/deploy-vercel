import { QueryData, SupabaseClient } from '@supabase/supabase-js'

import { Tables } from '../../utils/supabase/types'
import { ResponseData } from '../../lib/common'
import { getOrganizationByTagName } from '../organizations/queries'

export const getSingleUserOrganizationByUser = async (client: SupabaseClient) => {
  const { data: userData } = await client.auth.getUser()
  const { data } = await client
    .from('user_orgs')
    .select(
      `
        role,
        org:org_id (tag, display_name)
      `,
    )
    .eq('user_id', userData?.user?.id)
    .limit(1)
    .single()

  return {
    userData,
    userOrg: data,
  }
}

export const getUserOrganizationListByUser = async (client: SupabaseClient) => {
  const { data: userData } = await client.auth.getUser()
  const { data } = await client
    .from('user_orgs')
    .select(
      `
      role,
      user_id,
      org (tag, display_name)
    `,
    )
    .eq('user_id', userData?.user?.id)

  return data
}

export type UserListT = Tables<'user_orgs'> & { org: Tables<'org'>[]; user: Tables<'user'>[] }
export const getUserList = async (
  client: SupabaseClient,
  tag: string,
): Promise<ResponseData<UserListT> | null> => {
  if (!client || !tag) return null
  const org = await getOrganizationByTagName(client, tag)
  if (!org) return null
  const data = await client
    .from('user_orgs')
    .select(
      `
    role,
    user_id,
    created_at,
    org (tag, display_name),
    user (display_name)
  `,
      { count: 'exact' },
    )
    .eq('org_id', org.id)

  return data as QueryData<UserListT>
}

import { QueryData, SupabaseClient } from '@supabase/supabase-js'

import { ResponseData } from '@/lib/common'
import { createClient } from '@/utils/supabase/server'

import { OrganizationModels, UserOrgT, UserListT, OrgT } from './types'

export const getUserAuth = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  return userData
}

export async function updateOrganizationById(
  client: SupabaseClient,
  params: {
    id: string
    data: Partial<OrganizationModels>
  },
) {
  const { data } = await client
    .from('org')
    .update(params.data)
    .match({ id: params.id })
    .throwOnError()
    .select<string, OrganizationModels>('*')
    .throwOnError()
    .single()

  return data
}

export const getUserOrganizationListByUser = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData?.user?.id
  if (!userId) return null

  // just select all columns for easier typings
  // since the columns are not a lot
  const { data } = await supabase
    .from('user_orgs')
    .select(
      `
      *,
      org (*)
    `,
    )
    .eq('user_id', userId)

  return data as UserOrgT[]
}

export const getUserList = async (): Promise<ResponseData<UserListT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null
  const data = await supabase
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
    .eq('org_id', orgId)
  return data as QueryData<UserListT>
}

export async function chooseOrg(org: OrgT) {
  const supabase = createClient()
  // store the selected org to the user_metadata
  const result = await supabase.auth.updateUser({ data: { org } })
  return result
}

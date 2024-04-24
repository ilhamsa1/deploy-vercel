import { QueryData, SupabaseClient } from '@supabase/supabase-js'

import { calculatePageAndPageSize, ResponseData } from '@/lib/common'
import { createClient } from '@/utils/supabase/server'

import { OrganizationModels, OrgT, OrgInviteT, UserOrgT, UserListT, OrgJoinRequestT } from './types'
import { PaginationParam } from '@/interfaces'

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

export const getUserList = async ({
  page,
  pageSize,
  searchDisplayName,
}: PaginationParam & { searchDisplayName?: string }): Promise<ResponseData<UserListT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null

  const { from, to } = calculatePageAndPageSize({ page, pageSize })

  let query = supabase
    .from('user_orgs')
    .select(
      `
      *,
      org(*),
      user(*)
    `,
      { count: 'exact' },
    )
    .eq('org_id', orgId)
    .range(from, to)

  if (searchDisplayName) {
    query = query.ilike('user.display_name', `%${searchDisplayName}%`)
  }

  const data = await query

  return data as QueryData<UserListT>
}

export const getOrgInvites = async (): Promise<ResponseData<OrgInviteT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null
  const data = await supabase
    .from('org_invite')
    .select(
      `
      *,
      user:created_by (
        *
      )
      `,
      { count: 'exact' },
    )
    .eq('org_id', orgId)
  return data as QueryData<OrgInviteT>
}

export const getOrgJoinRequests = async (): Promise<ResponseData<OrgJoinRequestT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null
  const data = await supabase
    .from('org_join_request')
    .select(
      `
      *,
      user (
        *
      )
      org (
        *
      )
      `,
      { count: 'exact' },
    )
    .eq('org_id', orgId)
  return data as QueryData<OrgJoinRequestT>
}

export async function chooseOrg(org: OrgT) {
  const supabase = createClient()
  // store the selected org to the user_metadata
  const result = await supabase.auth.updateUser({ data: { org } })
  return result
}

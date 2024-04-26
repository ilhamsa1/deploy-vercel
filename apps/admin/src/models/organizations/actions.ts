import { QueryData, SupabaseClient } from '@supabase/supabase-js'

import { ResponseData } from '@/lib/common'
import { createClient } from '@/utils/supabase/server'

import {
  extractOperandAndOperatorCursor,
  getNextCursor,
  getPrevCursor,
  orderParamToOrderOptions,
} from '@/lib/pagination'

import { OrganizationModels, OrgT, OrgInviteT, UserOrgT, UserListT, OrgJoinRequestT } from './types'

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
  cursor,
  pageSize,
  sortModel,
}: {
  cursor: string
  pageSize: number
  sortModel?: string
}): Promise<ResponseData<UserListT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null

  const orderEntries = orderParamToOrderOptions(sortModel || '')

  let query = supabase
    .from('user_orgs')
    .select(
      `
      *,
      org(*),
      user(*)
    `,
      { count: 'estimated' },
    )
    .throwOnError()
    .eq('org_id', orgId)

  for (const [column, options] of orderEntries) {
    if (column) {
      query = query.order(column, options)
    }
  }

  if (cursor) {
    const { operator, operand } = extractOperandAndOperatorCursor(cursor)
    if (operator === 'or') {
      query = query.or(operand)
    } else {
      throw new Error('Invalid cursor')
    }
  }

  const result = await query.limit(pageSize || 10)

  let next_cursor: typeof cursor = ''
  let prev_cursor: typeof cursor = ''
  let has_next_page = false

  if (!!result.data && result.data.length > 0) {
    const firstItem = result.data[0]
    prev_cursor = getPrevCursor(orderEntries, firstItem, 'user_id')

    if (result.data.length >= pageSize) {
      has_next_page = true
      const lastItem = result.data[result.data.length - 1]
      next_cursor = getNextCursor(orderEntries, lastItem, 'user_id')
    }
  }

  return { ...result, next_cursor, prev_cursor, has_next_page } as QueryData<UserListT>
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

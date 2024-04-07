import { SupabaseClient } from '@supabase/supabase-js'

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

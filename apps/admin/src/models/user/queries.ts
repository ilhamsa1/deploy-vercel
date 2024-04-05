import { SupabaseClient } from '@supabase/supabase-js'

export const getUserOrganizationByUser = async (client: SupabaseClient) => {
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
    .single()

  return {
    userData,
    userOrg: data,
  }
}

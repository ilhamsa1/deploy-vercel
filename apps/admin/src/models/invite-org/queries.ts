import { SupabaseClient } from '@supabase/supabase-js'

export const inviteUserToOrganization = async (client: SupabaseClient, role: string) => {
  const { data: userData } = await client.auth.getUser()

  const orgId = userData.user?.user_metadata?.org?.id

  if (!orgId) throw new Error('Organization is not found')

  // NOTE: this code should run in db transaction
  const { data } = await client
    .from('org_invite')
    .insert({
      org_id: orgId,
      role,
      created_by: userData?.user?.id,
    })
    .select(
      `
      role,
      code,
      org_id,
      org (tag, display_name)
    `,
    )
    .throwOnError()
    .limit(1)
    .single()

  return data
}

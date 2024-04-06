import { Database } from '@/utils/supabase/types'
import { SupabaseClient } from '@supabase/supabase-js'

export const joinOrganizationByInvitationCode = async (
  client: SupabaseClient<Database>,
  code: string,
) => {
  const { data: userData } = await client.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { data: orgInvite } = await client
    .from('org_invite')
    .select('*')
    .eq('code', code)
    .is('accepted_at', null)
    .limit(1)
    .single()

  if (!orgInvite) throw new Error('Code is not valid')

  // NOTE: this code should run in db transaction
  const { data } = await client
    .from('user_orgs')
    .insert({
      user_id: userData.user.id,
      org_id: orgInvite.org_id,
      role: orgInvite.role,
    })
    .select(
      `
      role,
      user_id,
      org (tag, display_name)
    `,
    )
    .throwOnError()
    .limit(1)
    .single()

  //  handle di weebhook
  await client
    .from('org_invite')
    .update({
      accepted_at: new Date().toISOString(),
    })
    .match({ id: orgInvite.id })
    .throwOnError()

  return data
}

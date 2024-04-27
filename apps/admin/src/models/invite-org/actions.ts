import { createClient } from '@/utils/supabase/server'

export const inviteUserToOrg = async (role: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  const org_id = userData.user?.user_metadata?.org?.id

  if (!org_id) throw new Error('Organization is not found')

  const { data } = await supabase
    .from('org_invite')
    .insert({
      org_id,
      role,
      created_by: userData?.user?.id || '',
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

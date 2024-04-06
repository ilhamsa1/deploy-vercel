import { SupabaseClient } from '@supabase/supabase-js'
import { getOrganizationByTagName } from '../organizations/queries'

export const inviteUserToOrganization = async (
  client: SupabaseClient<any>,
  role: string,
  org: string,
) => {
  const { data: userData } = await client.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const organization = await getOrganizationByTagName(client, org)

  if (!org) throw new Error('Organization is not found')

  // NOTE: this code should run in db transaction
  const { data } = await client
    .from('org_invite')
    .insert({
      org_id: organization.id,
      role,
      code: 'SK23Zy78',
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

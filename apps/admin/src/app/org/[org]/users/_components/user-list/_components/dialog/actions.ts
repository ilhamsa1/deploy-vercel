'use server'
import { inviteUserToOrganization } from '@/models/invite-org/queries'
import { createClient } from '@/utils/supabase/server'

export async function inviteUser(formData: { role: string }) {
  const supabase = createClient()

  const result = await inviteUserToOrganization(supabase, formData.role)
  return result
}

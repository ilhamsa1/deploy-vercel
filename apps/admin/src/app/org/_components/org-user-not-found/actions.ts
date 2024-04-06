'use server'
import { joinOrganizationByInvitationCode } from '@/models/join-org/queries'
import { createClient } from '@/utils/supabase/server'

export async function joinInviteCode(formData: { code: string }) {
  const supabase = createClient()

  const result = await joinOrganizationByInvitationCode(supabase, formData.code)
  return result
}

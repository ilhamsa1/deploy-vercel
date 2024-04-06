import { useMutation } from '@tanstack/react-query'
import { useSupabase } from '@/hooks'
import { joinOrganizationByInvitationCode } from './queries'

export const useJoinOrganizationByCodeMutation = () => {
  const client = useSupabase()

  const mutationFn = async (code: string) => {
    return await joinOrganizationByInvitationCode(client, code)
  }

  return useMutation({
    mutationFn,
    // TODO:
    // handle onSuccess typing error
  })
}

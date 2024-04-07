import { SupabaseClient } from '@supabase/supabase-js'
import { OrganizationModels } from './types'

export const getOrganizationById = async (client: SupabaseClient, organizationId: number) => {
  const { data } = await client
    .from('org')
    .select()
    .eq('id', organizationId)
    .throwOnError()
    .single()

  return data
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

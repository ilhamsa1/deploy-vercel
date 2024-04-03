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

export const createOrganization = async (
  client: SupabaseClient,
  organization: OrganizationModels,
) => {
  const { data, error } = await client.from('org').insert(organization)
  if (error) {
    throw error
  }

  return data
}

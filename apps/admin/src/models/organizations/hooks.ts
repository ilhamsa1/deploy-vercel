import { useMutation, useQuery } from '@tanstack/react-query'
import { getOrganizationById, updateOrganizationById } from './queries'
import { useSupabase } from '../../hooks'
import { OrganizationModels } from './types'
import { ParamsUpdateMutation } from '../../interfaces'

export const useFetchOrganizationQuery = (organizationId: number) => {
  const client = useSupabase()
  const queryKey = ['organization', organizationId]

  const queryFn = async () => {
    return await getOrganizationById(client, organizationId)
  }

  return useQuery({ queryKey, queryFn })
}

export const useUpdateOrganizationMutation = () => {
  const client = useSupabase()

  const mutationFn = async (params: ParamsUpdateMutation<OrganizationModels>) => {
    return await updateOrganizationById(client, params)
  }

  return useMutation({
    mutationFn,
    // TODO:
    // handle onSuccess typing error
  })
}

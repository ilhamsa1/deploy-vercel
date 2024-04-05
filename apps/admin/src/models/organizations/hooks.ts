import { useMutation, useQuery } from '@tanstack/react-query'
import { getOrganizationByTagName, updateOrganizationById } from './queries'
import { useSupabase } from '../../hooks'
import { OrganizationModels } from './types'
import { ParamsUpdateMutation } from '../../interfaces'

export const useFetchOrganizationQuery = (tag: string) => {
  const client = useSupabase()
  const queryKey = ['organization', tag]

  const queryFn = async () => {
    return await getOrganizationByTagName(client, tag)
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

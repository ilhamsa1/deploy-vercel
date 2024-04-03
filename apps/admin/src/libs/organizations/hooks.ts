import { useMutation, useQuery } from '@tanstack/react-query'
import { createOrganization, getOrganizationById } from './queries'
import { useSupabase } from '../../hooks'
import { OrganizationModels } from './types'

export const useFetchOrganizationQuery = (organizationId: number) => {
  const client = useSupabase()
  const queryKey = ['organization', organizationId]

  const queryFn = async () => {
    return getOrganizationById(client, organizationId)
  }

  return useQuery({ queryKey, queryFn })
}

export const useCreateOrganizationQuery = () => {
  const client = useSupabase()
  const mutationKey = ['organization']

  const mutationFn = async (organization: OrganizationModels) => {
    return createOrganization(client, organization)
  }

  return useMutation({ mutationFn, mutationKey })
}

import { Adapter, AdapterAccount, AdapterUser } from '@auth/core/adapters'

import type { ApiErrorResponse, ResponseAdapterUser } from '../utils/types'
import { api } from '../services/api'

const checkForAuthError = (data: ApiErrorResponse) => {
  if (data && data.meta && data.meta.code && data.meta.code === 403) {
    throw new Error('Auth error')
  }
}

export function ServiceAdapter(): Adapter {
  return {
    async getUserByAccount(provider_providerAccountId) {
      const { provider, providerAccountId } = provider_providerAccountId
      const { data } = await api.get<ResponseAdapterUser & ApiErrorResponse>(
        `/api/private/users/${provider}/${providerAccountId}`,
      )
      checkForAuthError(data as ApiErrorResponse)
      const user = (data?.data as AdapterUser) || null
      return user
    },
    async getUser(id) {
      const { data } = await api.get<ResponseAdapterUser & ApiErrorResponse>(
        `/api/private/users/${id}`,
      )
      checkForAuthError(data as ApiErrorResponse)
      return data?.data || null
    },
    async getUserByEmail(email) {
      const { data } = await api.get<ResponseAdapterUser & ApiErrorResponse>(
        `/api/private/users/${email}`,
      )
      checkForAuthError(data as ApiErrorResponse)
      return data?.data || null
    },
    async createUser(userData) {
      const response = await api.post<ResponseAdapterUser & ApiErrorResponse>(
        `/api/private/users`,
        {
          name: userData.name,
          email: userData.email,
        },
      )
      const { data } = response
      checkForAuthError(data as ApiErrorResponse)
      if (!data || !data.data.id || !data.data.email)
        throw new Error('Error on create user')
      const newUser = {
        id: data.data.id,
        email: data.data.email,
        name: data.data.name,
        emailVerified: null,
      }
      return newUser
    },
    async linkAccount(accountData) {
      const response = await api.patch<AdapterAccount & ApiErrorResponse>(
        `/api/private/users/${accountData.userId}`,
        {
          provider: accountData.provider,
          token: accountData.providerAccountId,
        },
      )
      const { data } = response
      checkForAuthError(data as ApiErrorResponse)
      if (!data) throw new Error('Error on link account')
      return data
    },
  }
}

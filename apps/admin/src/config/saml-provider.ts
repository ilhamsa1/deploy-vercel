import { IdentityProvider, SAMLAssertResponse } from 'saml2-js'
import { AdapterUser } from '@auth/core/adapters'
import Credentials from '@auth/core/providers/credentials'

import { api } from '../services/api'
import { ResponseAdapterUser, ApiErrorResponse } from '../utils/types'

import { identityProvider } from './identity-provider'
import { serviceProvider } from './service-provider'

const SAML_PROVIDER = 'saml'

// Custom SAML Provider using authjs Credentials provider
// need to handle storing data to database manually
// Credentials provider will not call the adapter
export const SamlProvider = Credentials({
  id: SAML_PROVIDER,
  name: SAML_PROVIDER,
  credentials: {
    samlBody: { type: 'text' },
  },
  authorize: async (credentials) => {
    if (!credentials.samlBody) return null
    const samlBodyParsed = decodeURIComponent(credentials.samlBody as string)

    const postAssert = (
      identityProvider: IdentityProvider,
      samlBodyParsed: string,
    ) =>
      new Promise((resolve, reject) => {
        serviceProvider.post_assert(
          identityProvider,
          {
            request_body: { SAMLResponse: samlBodyParsed },
            require_session_index: false,
          },
          (error, response) => {
            if (error) reject(error)
            resolve(response)
          },
        )
      })

    try {
      const response: SAMLAssertResponse = (await postAssert(
        identityProvider,
        samlBodyParsed,
      )) as SAMLAssertResponse
      if (!response.user || !response.user.attributes) throw new Error('error')

      const name = response.user.attributes.name[0]
      const email = response.user.attributes.email[0]

      // fetch or create user
      const { data } = await api.post<ResponseAdapterUser & ApiErrorResponse>(
        `/api/private/users/fetch_or_create`,
        {
          name,
          email,
          provider: SAML_PROVIDER,
          token: response.user.name_id,
        },
      )
      const appUser = (data?.data as AdapterUser) || null
      return appUser
    } catch (error) {
      console.error(error)
      return null
    }
  },
})

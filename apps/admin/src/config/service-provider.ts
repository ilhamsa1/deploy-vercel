import { ServiceProvider } from 'saml2-js'
import { env } from 'next-runtime-env'

const entityId = env('AUTH_SAML_ENTITY_ID') || ''
const privateKey = env('AUTH_SAML_PRIVATE_KEY') || ''
const certificate = env('AUTH_SAML_CERTIFICATE') || ''
const assertEndpoint = env('AUTH_SAML_ASSERT_ENDPOINT') || ''

export const serviceProvider = new ServiceProvider({
  entity_id: entityId,
  private_key: privateKey,
  certificate,
  assert_endpoint: assertEndpoint,
  allow_unencrypted_assertion: true,
})

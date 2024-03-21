import { IdentityProvider } from 'saml2-js'
import { env } from 'next-runtime-env'

const ssoLoginUrl = env('AUTH_SAML_SSO_LOGIN_URL') || ''
const ssoLogoutUrl = env('AUTH_SAML_SSO_LOGOUT_URL') || ''
const certificate = env('AUTH_SAML_SSO_CERTIFICATE') || ''

export const identityProvider = new IdentityProvider({
  sso_login_url: ssoLoginUrl,
  sso_logout_url: ssoLogoutUrl,
  certificates: [certificate],
})

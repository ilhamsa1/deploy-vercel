import NextAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { env } from 'next-runtime-env'

import { ServiceAdapter } from '../adapters/service'
import { api } from '../services/api'
import { ApiErrorResponse } from '../utils/types'

import { GoogleProvider } from './google-provider'
import { SamlProvider } from './saml-provider'

const DUR_15_MIN = 60 * 15
const DUR_15_DAYS = 60 * 60 * 24 * 15

const secret = env('AUTH_SECRET')
const authUrl = env('AUTH_URL') || 'http://localhost:3000/api/auth'
const useSecureCookies = authUrl ? authUrl.startsWith('https://') : false
const cookiePrefix = useSecureCookies ? '__Secure-' : ''
const hostName = new URL(authUrl).hostname

// session cookie
// use lower 15 minute expiry for secure cookie (used in staging & production)
const maxAge = useSecureCookies ? DUR_15_MIN : DUR_15_DAYS

// this is to enable saml login
const useSaml = !!env('AUTH_USE_SAML')

const providers = []

// currenlty we only supporting either or scenario
// in user table only can link one of the provider
// saml provider is using one cloudflare that is linked to google account
if (!useSaml) providers.push(GoogleProvider)
if (useSaml) providers.push(SamlProvider)

const config = {
  adapter: ServiceAdapter(),
  secret,
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      // admin check exists if continued otherwise add data
      if (!user || !user.email || !account) return false
      return true
    },
    async session({ session, token }) {
      if (!token) throw new Error('Not allowed')

      // set image from google jwt token to session user
      if (session && session.user && token.image)
        session.user.image = token.image as string

      return session
    },
    async jwt({ token, user, profile }) {
      if (user && user.id) {
        token.userType = 'admin' // user is of type admin
        token.type = 'admin' // this jwt is of admin type

        // Get Tera's API Token (only on login and token refresh)
        const { data } = await api.post<
          { data: { token: string } } & ApiErrorResponse
        >(`/api/private/auth/generate_api_token`, { user_id: user.id })
        if (data?.data.token) {
          token.apiToken = data?.data.token
        }
      }

      if (
        token && //
        token.sub &&
        (token.type !== 'admin' || token.userType !== 'admin')
      ) {
        throw new Error('Not allowed')
      }

      if (profile && profile.picture) {
        token.image = profile.picture
      }

      return token
    },
    async authorized({ auth }) {
      return !!auth
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        maxAge,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
        domain: hostName == 'localhost' ? hostName : '.' + hostName,
      },
    },
  },
} satisfies NextAuthConfig

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config)

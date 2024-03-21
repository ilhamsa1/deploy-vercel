import Google from '@auth/core/providers/google'
import { env } from 'next-runtime-env'

export const GoogleProvider = Google({
  clientId: env('AUTH_GOOGLE_ID'),
  clientSecret: env('AUTH_GOOGLE_SECRET'),
  authorization: {
    params: {
      prompt: 'consent',
      access_type: 'offline',
      response_type: 'code',
    },
  },
})

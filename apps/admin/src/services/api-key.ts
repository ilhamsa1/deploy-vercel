import { createClient } from '@supabase/supabase-js'

export async function apiKey(req: Request) {
  const authorizationHeader =
    req.headers && 'Authorization' in req.headers ? 'Authorization' : 'authorization'
  const authHeader = req.headers && req.headers.get(authorizationHeader)
  if (!authHeader) throw new Error('credentials_bad_format')

  const user_api_key = (authHeader as string).split(' ')[1] || ''

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: user_api_key,
        },
      },
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    },
  )
}

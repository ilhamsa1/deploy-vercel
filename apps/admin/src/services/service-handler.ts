import { createClient } from '@/utils/supabase/server'

export async function serviceHandler(req: Request) {
  const supabase = createClient()
  let accountId = ''

  const authorizationHeader =
    req.headers && 'Authorization' in req.headers ? 'Authorization' : 'authorization'
  const authHeader = req.headers && req.headers.get(authorizationHeader)
  if (!authHeader) throw new Error('credentials_bad_format')

  const parts = (authHeader as string).split(' ')
  if (parts.length == 2) {
    const scheme = parts[0]
    const credentials = parts[1]
    if (/^Bearer$/i.test(scheme)) {
      const key = (credentials as string).split('-')
      const public_id = key[0]
      const secret_key = key[1]
      const { data: accessKey } = await supabase
        .from('public_id')
        .select('*')
        .eq('public_id', public_id)
        .eq('secret', secret_key)
        .limit(1)
        .single()

      if (public_id !== accessKey.public_id || secret_key !== accessKey.secret)
        throw new Error('invalid_auth')
      accountId = accessKey.accountId
    } else {
      throw new Error('credentials_bad_format')
    }
  } else {
    throw new Error('credentials_bad_format')
  }

  return accountId
}

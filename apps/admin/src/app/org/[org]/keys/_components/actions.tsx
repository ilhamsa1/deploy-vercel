'use server'

import { listApiKey, createApiKey, getApiKey, revokeApiKey } from '@/models/handle-api-key/actions'
import { getUserAuth } from '@/models/organizations/actions'
import { createClient } from '@/utils/supabase/server'

export const getApiKeyList = listApiKey
export const revokeKey = revokeApiKey
export const getUser = getUserAuth

export async function login(formData: { email: string; password: string; description: string }) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  }

  await supabase.auth.signInWithPassword(data)
  const secretKey = await createApiKey(formData.description)
  const accessKey = await getApiKey(secretKey)

  return accessKey
}

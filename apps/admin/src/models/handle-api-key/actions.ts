import { createClient } from '@/utils/supabase/server'

export const createApiKey = async (keyDescription: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { error } = await supabase.rpc('create_api_key', { userData.user.id, keyDescription })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const listApiKey = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { data, error } = await supabase.rpc('list_api_keys', { userData.user.id })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const getApiKey = async (secretId: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { error, data } = await supabase.rpc('get_api_key', { userData.user.id, secretId })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const revokeApiKey = async (secretId: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { error } = await supabase.rpc('revoke_api_key', { userData.user.id, secretId })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

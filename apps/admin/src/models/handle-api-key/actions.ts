import { createClient } from '@/utils/supabase/server'

export const createApiKey = async (key_description: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { data, error } = await supabase.rpc('create_api_key', {
    id_of_user: userData.user.id,
    key_description,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const listApiKey = async () => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { data, error } = await supabase.rpc('list_api_keys', { id_of_user: userData.user.id })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const getApiKey = async (secret_id: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { error, data } = await supabase.rpc('get_api_key', {
    id_of_user: userData.user.id,
    secret_id,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const revokeApiKey = async (key_secret_id: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { error } = await supabase.rpc('revoke_api_key', {
    id_of_user: userData.user.id,
    key_secret_id,
  })

  if (error) {
    throw new Error(error.message)
  }

  return true
}

export const securityConfirmAccess = async (email_user: string, password_user: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) throw new Error('No Authorization')

  const { data } = await supabase.rpc('security_confirm', {
    id_of_user: userData.user.id,
    email_user,
    password_user,
  })

  if (!data) {
    throw new Error('Wrong email & password')
  }

  return true
}

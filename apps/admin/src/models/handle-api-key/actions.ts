import { createClient } from '@/utils/supabase/server'
import { z, ZodIssue } from 'zod'

export const createApiKey = async (key_description: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  await validateCreateApiKey({ description: key_description })

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
  await validateSecretKey({ secret_id })

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
  await validateSecretKey({ secret_id: key_secret_id })

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

export const securityConfirmAccess = async (password_user: string) => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  const email_user = userData?.user?.email || ''
  await validateConfirmAccess({ password: password_user })

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

export const validateCreateApiKey = async (payload: z.infer<typeof FormSchemaCreateApiKey>) => {
  try {
    await FormSchemaCreateApiKey.parse(payload)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const serverErrors = Object.fromEntries(
        err?.issues?.map((issue: ZodIssue) => ['message', issue.message]) || [],
      )
      throw new Error(serverErrors.message)
    }
  }
}

export const validateConfirmAccess = async (payload: z.infer<typeof FormSchemaConfirmAccess>) => {
  try {
    await FormSchemaConfirmAccess.parse(payload)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const serverErrors = Object.fromEntries(
        err?.issues?.map((issue: ZodIssue) => ['message', issue.message]) || [],
      )
      throw new Error(serverErrors.message)
    }
  }
}

export const validateSecretKey = async (payload: z.infer<typeof FormSchemaSecretKey>) => {
  try {
    await FormSchemaSecretKey.parse(payload)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const serverErrors = Object.fromEntries(
        err?.issues?.map((issue: ZodIssue) => ['message', issue.message]) || [],
      )
      throw new Error(serverErrors.message)
    }
  }
}

const FormSchemaConfirmAccess = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
})

const FormSchemaCreateApiKey = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
})

const FormSchemaSecretKey = z.object({
  secret_id: z.string().min(1, { message: 'Secret key is required' }),
})

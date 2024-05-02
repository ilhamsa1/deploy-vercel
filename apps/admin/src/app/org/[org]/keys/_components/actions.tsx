'use server'

import {
  listApiKey,
  createApiKey,
  getApiKey,
  revokeApiKey,
  securityConfirmAccess,
} from '@/models/handle-api-key/actions'
import { getUserAuth } from '@/models/organizations/actions'

export const getApiKeyList = listApiKey
export const revokeKey = revokeApiKey
export const getUser = getUserAuth

export async function securityConfirm(formData: {
  email: string
  password: string
  description: string
}) {
  await securityConfirmAccess(formData.email, formData.password)
  const secretKey = await createApiKey(formData.description)
  const accessKey = await getApiKey(secretKey)

  return accessKey
}

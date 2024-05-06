import { z, ZodIssue } from 'zod'

import { QueryData } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { ResponseData } from '@/lib/common'
import { FormSchemaWebHooks } from '@/components/event/schema'

import { WebHookListT } from './types'

export const getWebHooks = async (): Promise<ResponseData<WebHookListT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()

  const org_id = userData.user?.user_metadata?.org?.id

  if (!org_id) throw new Error('Organization is not found')

  const data = await supabase.from('webhook_endpoint').select('*').eq('org_id', org_id)

  if (data.error) {
    throw new Error(data.error.message)
  }

  return data as QueryData<WebHookListT>
}

export const createWebHooks = async (formData: {
  url: string
  description: string
  api_version: string
  enabled_events: string[]
}): Promise<ResponseData<WebHookListT> | null> => {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  await validateWebhooks(formData)

  const org_id = userData.user?.user_metadata?.org?.id

  if (!org_id) throw new Error('Organization is not found')

  const { data: account, error: errorAct } = await supabase
    .from('business_account')
    .select('id, org_id')
    .eq('org_id', org_id)
    .eq('user_id', userData.user?.id || '')
    .throwOnError()
    .limit(1)
    .single()

  if (errorAct) {
    throw new Error(errorAct.message)
  }

  const data = await supabase
    .from('webhook_endpoint')
    .insert({
      ...formData,
      status: 'enabled',
      account_id: account?.id,
    })
    .select('*')
    .throwOnError()
    .single()

  if (data.error) {
    throw new Error(data.error.message)
  }

  return data as QueryData<WebHookListT>
}

export const validateWebhooks = async (payload: z.infer<typeof FormSchemaWebHooks>) => {
  try {
    await FormSchemaWebHooks.parse(payload)
  } catch (err) {
    if (err instanceof z.ZodError) {
      const serverErrors = Object.fromEntries(
        err?.issues?.map((issue: ZodIssue) => ['message', issue.message]) || [],
      )
      throw new Error(serverErrors.message)
    }
  }
}

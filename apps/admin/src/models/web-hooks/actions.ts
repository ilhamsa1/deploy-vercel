import { QueryData } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'
import { ResponseData } from '@/lib/common'

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

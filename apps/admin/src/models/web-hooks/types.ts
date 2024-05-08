import { Tables } from '@/utils/supabase/types'
export type WebHookListT = Tables<'webhook_endpoint'> & { org: Tables<'org'> }

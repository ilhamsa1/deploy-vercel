import { Tables } from '@/utils/supabase/types'
export interface OrganizationModels {
  id: string
  tag: string
  displayName?: string
  tier: number
}

export type OrgT = Tables<'org'>

export type UserOrgT = Tables<'user_orgs'> & { org: Tables<'org'> }

export type UserListT = Tables<'user_orgs'> & { org: Tables<'org'>[]; user: Tables<'user'>[] }

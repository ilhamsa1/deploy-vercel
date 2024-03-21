import type { AdapterUser } from '@auth/core/adapters'

export type ApiErrorResponse = {
  meta: { code: number }
}

export type ResponseAdapterUser = { data: AdapterUser }

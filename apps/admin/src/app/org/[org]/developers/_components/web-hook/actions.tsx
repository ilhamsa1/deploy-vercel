'use server'

import { createWebHooks as _createWebhooks, getWebHooks } from '@/models/web-hooks/actions'

export const getWebHooksList = getWebHooks
export const createWebHooks = _createWebhooks

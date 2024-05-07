'use server'

import {
  getWebHooksById as _getWebHooksById,
  updateWebHooksById as _updateWebHooksById,
} from '@/models/web-hooks/actions'

export const getWebHooksById = _getWebHooksById
export const updateWebHooksById = _updateWebHooksById

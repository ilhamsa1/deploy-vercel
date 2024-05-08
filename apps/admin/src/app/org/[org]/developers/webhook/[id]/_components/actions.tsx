'use server'

import {
  getWebHooksById as _getWebHooksById,
  updateWebHooksById as _updateWebHooksById,
  deleteWebHooksById as _deleteWebHooksById,
} from '@/models/web-hooks/actions'

export const getWebHooksById = _getWebHooksById
export const updateWebHooksById = _updateWebHooksById
export const deleteWebHooksById = _deleteWebHooksById

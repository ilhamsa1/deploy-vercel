import { eventEmitter } from '../utils/event'

export interface ParsedError {
  code: number
  type: string
  message: string
}

interface ErrorResponse {
  problem: string
  data: {
    meta?: {
      code?: number
      type?: string
      message: string
    }
  }
}

const parseError = (response: ErrorResponse): ParsedError => {
  switch (response.problem) {
    case 'CLIENT_ERROR':
    case 'SERVER_ERROR':
      if (response.data?.meta && response.data?.meta.message) {
        return {
          code: response.data.meta.code || 400,
          type: response.data.meta.type || 'externalError',
          message: response.data.meta.message,
        }
      }
      return {
        code: 400,
        type: 'externalError',
        message: 'server.external_error',
      }
    case 'TIMEOUT_ERROR':
      return {
        code: 0,
        type: 'connectionTimeout',
        message: 'server.timeout_error',
      }
    case 'CONNECTION_ERROR':
      return {
        code: 0,
        type: 'dnsError',
        message: 'server.connection_error',
      }
    case 'NETWORK_ERROR':
      return {
        code: 0,
        type: 'networkUnavailable',
        message: 'server.network_error',
      }
    default:
      return {
        code: 0,
        type: 'uncategorized',
        message: 'server.unknown_error',
      }
  }
}

const handleErrorResponse = (
  response: ErrorResponse,
  options: { silentFail?: boolean } = {},
): ParsedError => {
  const err = parseError(response)
  // eslint-disable-next-line no-console
  if (process.env['NODE_ENV'] !== 'production') console.log(err)
  if (!options.silentFail) {
    eventEmitter.emit('NOTIF_ERROR', err)
  }
  return err
}

export default handleErrorResponse

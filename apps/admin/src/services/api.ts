import { create } from 'apisauce'
import axiosRetry from 'axios-retry'
import { AxiosError } from 'axios'
import qs from 'qs'
import { env } from 'next-runtime-env'

const _api = create({
  baseURL: env('API_URL'),
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  paramsSerializer: {
    serialize: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  },
  timeout: 30000,
})

const retryCondition = (error: AxiosError) => {
  return (
    axiosRetry.isNetworkError(error) || axiosRetry.isSafeRequestError(error) // only retry for get
  )
}

axiosRetry(_api.axiosInstance, {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition,
})

export const api = _api

import { create } from 'apisauce'

// define the base URL
const api = create({
  baseURL: 'http://localhost:4100/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

export const setApiAuth = (token: string) => api.setHeader('Authorization', token)

export default api

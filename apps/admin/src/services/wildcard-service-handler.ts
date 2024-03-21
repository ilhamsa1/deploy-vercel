import type { NextApiRequest, NextApiResponse } from 'next'

import { auth } from '../config/auth'
import { apiAuth } from './api-auth'

export async function wildcardServiceHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  checkType: string,
): Promise<Response> {
  if (!req.url || !req.method) throw new Error('Invalid request')
  const session = await auth(req, res)
  if (!session || !session.user) throw new Error('Missing authentication')

  const url = new URL(req.url)
  const path = url.pathname.substring(12)
  if (!path) throw new Error('Missing path')
  const fetchPath = `${path}${url.search}`

  const response = await apiAuth(fetchPath, req.method, req.body)
  if (!response) throw new Error('Missing response')
  return response
}

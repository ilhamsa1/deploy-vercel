import { env } from 'next-runtime-env'

export const apiAuth = async (
  path: string,
  method: string,
  body?: any,
): Promise<Response | null> => {
  try {
    const fetchUrl = `${env('API_URL')}${path}`

    const meta: any = {
      headers: {
        'Content-Type': 'application/json',
      },
      method,
    }

    if (body) {
      meta.duplex = 'half'
      meta.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    return await fetch(fetchUrl, meta)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const parseApiResponse = async <T>(
  response: Response,
): Promise<{ data: T; error?: Error; ok: boolean; status: number }> => {
  return {
    data: (await response.json()) as T,
    ok: response.ok,
    status: response.status,
  }
}

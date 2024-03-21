import axios from 'axios'
import { NextRequest } from 'next/server'
import { env } from 'next-runtime-env'

// ref: https://github.com/nextauthjs/next-auth/issues/311#issuecomment-704293988
// need to do this html post simulation because next auth need the csrf token
// can't directly land to /api/auth/callback/saml from the saml origin
async function handler(req: NextRequest) {
  try {
    const formData = await req.formData()
    if (!formData) throw new Error('error')
    // First, grab a CSRF token.
    const result = await axios('/api/auth/csrf', {
      baseURL: env('BASE_URL'),
    })
    if (!result || !result.headers || !result.data) throw new Error('error')

    const { csrfToken } = result.data

    const samlResponse = formData.get('SAMLResponse')
    if (!samlResponse) throw new Error('error')

    // Then, encode the SAML body to be sent as a "credential" and parsed.
    const encodedSAMLBody = encodeURIComponent(samlResponse as string)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const setCookie = result.headers.get('set-cookie') || ''

    return new Response(
      `<html>
        <body>
          <form action="/api/auth/callback/saml" method="POST">
            <input type="hidden" name="csrfToken" value="${csrfToken}"/>
            <input type="hidden" name="samlBody" value="${encodedSAMLBody}"/>
          </form>
          <script>
            document.forms[0].submit();
          </script>
        </body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Set-Cookie': setCookie,
        },
      },
    )
  } catch (e) {
    console.log({ error: e, message: 'Error while processing SAML response' })
    throw e
  }
}

export { handler as POST }

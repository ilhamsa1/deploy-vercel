import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const code = searchParams.get('code')

  // if "next" is in param, use it in the redirect URL
  const redirectUrl = searchParams.get('next') ?? '/org'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${process.env.BASE_URL}${redirectUrl}`)
    }
  }

  // TODO: Create this page
  // return the user to an error page with instructions
  return NextResponse.redirect(`${process.env.BASE_URL}/auth/auth-error`)
}

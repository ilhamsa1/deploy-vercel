import { NextRequest, NextResponse } from 'next/server'
import { createClient, PostgrestError } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const user_api_key = authHeader?.split(' ')[1]

  if (!user_api_key) {
    return NextResponse.json({ error: 'User api key not provided' })
  }

  // Initialize the Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: user_api_key,
        },
      },
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    },
  )

  // Assuming there's a table called 'users' and you're querying based on the user's API key
  const { data, error } = await supabase.from('user').select('*').maybeSingle() // .maybeSingle() returns either one record or null if none found
  if (error) {
    const formattedError: PostgrestError = {
      message: error.message,
      details: error.details || 'No additional details provided.',
      hint: error.hint || 'No hint provided.',
      code: error.code,
    }
    return NextResponse.json({ error: formattedError })
  }

  if (!data) {
    return NextResponse.json({ error: 'User not found' })
  }

  // Send back the user information
  return NextResponse.json({ data })
}

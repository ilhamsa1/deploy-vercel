import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = createClient()

  const { data, count } = await supabase
    .from('payment_intent')
    .select('*', { count: 'exact', head: true })
  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const params = await request.json()
  const { data: userData } = await supabase.auth.getUser()

  const orgId = userData.user?.user_metadata?.org?.id
  if (!orgId) return null

  const paymentIntent = { ...params, userId: userData.user, orgId }

  const { data } = await supabase
    .from('payment_intent')
    .insert(paymentIntent)
    .select('*')
    .throwOnError()
    .single()

  return NextResponse.json({ data })
}

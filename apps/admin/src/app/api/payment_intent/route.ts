import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { serviceHandler } from '@/services/service-handler'

export async function GET(request: Request) {
  const supabase = createClient()
  const accountId = await serviceHandler(request)

  const { data, count } = await supabase
    .from('payment_intent')
    .select('*', { count: 'exact', head: true })
    .eq('account_id', accountId)

  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = createClient()
  const params = await request.json()
  const accountId = await serviceHandler(request)

  const { data } = await supabase
    .from('payment_intent')
    .insert({ ...params, accountId })
    .select('*')
    .throwOnError()
    .single()

  return NextResponse.json({ data })
}

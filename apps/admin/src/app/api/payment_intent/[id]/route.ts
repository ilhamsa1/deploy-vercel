import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { serviceHandler } from '@/services/service-handler'

export async function GET(request: Request, context: { params: { id: string } }) {
  const paymentIntentId = context.params.id
  const supabase = createClient()
  const accountId = await serviceHandler(request)

  const { data } = await supabase
    .from('payment_intent')
    .select()
    .eq('id', paymentIntentId)
    .eq('account_id', accountId)
    .single()

  return NextResponse.json({ data })
}

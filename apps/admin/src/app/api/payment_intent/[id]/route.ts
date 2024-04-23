import { NextResponse } from 'next/server'
import { apiKey } from '@/services/api-key'

export async function GET(request: Request, context: { params: { id: string } }) {
  const paymentIntentId = context.params.id
  const supabase = await apiKey(request)

  const { data } = await supabase
    .from('payment_intent')
    .select()
    .eq('id2', paymentIntentId)
    .single()

  return NextResponse.json({ data })
}

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request, context: { params: { id: string } }) {
  const paymentIntentId = context.params.id
  const supabase = createClient()

  const { data } = await supabase.from('payment_intent').select().eq('id', paymentIntentId).single()

  return NextResponse.json({ data })
}

import { NextResponse } from 'next/server'
import { apiKey } from '@/services/api-key'
import zod from 'zod'

export async function GET(request: Request) {
  const supabase = await apiKey(request)

  const { data, count } = await supabase
    .from('payment_intent')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ data, count })
}

export async function POST(request: Request) {
  const supabase = await apiKey(request)
  const params = await request.json()
  await paymentIntentValidate(params)

  const { data } = await supabase
    .from('payment_intent')
    .insert({ ...params, status: 'requires_payment_method' })
    .select('*')
    .throwOnError()
    .single()

  return NextResponse.json({ data })
}

export const paymentIntentValidate = async (payload: zod.infer<typeof FormSchema>) => {
  const validationResult = (await FormSchema.safeParse(payload)) as { error?: string }

  if (validationResult.error) {
    throw new Error(validationResult.error)
  }
}

const FormSchema = zod.object({
  currency: zod.string(),
  amount: zod.number(),
  metadata: zod.object({}),
  customer: zod.string(),
  receipt_email: zod.string(),
})

import { type NextRequest, NextResponse } from 'next/server'
import { apiKey } from '@/services/api-key'
import zod from 'zod'

export async function GET(request: NextRequest) {
  const supabase = await apiKey(request)
  const searchParams = request.nextUrl.searchParams
  const requires_action = searchParams.get('requires_action')
  const amount = searchParams.get('amount')
  const cursor = searchParams.get('cursor')
  const limit = parseInt(searchParams.get('limit') as string) || 10

  let query = supabase.from('payment_intent').select('*')

  if (requires_action) {
    query = query.eq('status', requires_action)
  }
  if (amount) {
    query = query.gte('amount', amount)
  }

  if (cursor) {
    query = query.or(Buffer.from(cursor, 'base64').toString('utf-8'))
  }

  const response = await query.limit(limit + 1).order('payment_method', { ascending: true })

  let next_cursor: typeof cursor | null = null
  let prev_cursor: typeof cursor | null = null

  if (!!response.data && response.data.length > limit) {
    response.data = response.data.splice(0, limit)

    const firstItem = response.data[0]
    const lastItem = response.data[response.data.length - 1]

    if (firstItem) {
      prev_cursor = Buffer.from(`and=(id.lt.${firstItem.id},deleted_at.is.null)`).toString('base64')
    }

    if (lastItem) {
      next_cursor = Buffer.from(`and=(id.gt.${lastItem.id},deleted_at.is.null)`).toString('base64')
    }
  }

  return NextResponse.json({ data: response.data ?? [], prev_cursor, next_cursor })
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

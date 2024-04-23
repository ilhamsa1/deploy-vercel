import { type NextRequest, NextResponse } from 'next/server'
import { apiKey } from '@/services/api-key'
import zod from 'zod'

import {
  getNextCursor,
  getPrevCursor,
  orderParamToOrderOptions,
  extractOperandAndOperatorFilter,
  extractOperandAndOperatorCursor,
  RESERVED_SEARCH_KEYS,
} from '@/lib/pagination'
import { PAYMENT_INTENT_STATUS } from '@/lib/constant'
import { convertToDecimal } from '@/lib/common'

export async function GET(request: NextRequest) {
  const supabase = await apiKey(request)
  const searchParams = request.nextUrl.searchParams
  await validateGet(Object.fromEntries(searchParams.entries()))
  // Security issue if duplicate key: ?select=status&status=requires_action&status=&select=

  // Select: ?select=fullName:full_name,birthDate:birth_date
  const select = searchParams.get('select') || '*'
  // Order By: `?order=age.desc,height.asc`
  const orderParam = searchParams.get('order') || ''
  const cursor = searchParams.get('cursor')
  const limit = parseInt(searchParams.get('limit') || '')

  // Vertical Column Filtering: https://postgrest.org/en/v12/references/api/tables_views.html#vertical-filtering
  let query = supabase
    .from('payment_intent')
    .select<typeof select, Record<string, unknown>>(select, { count: 'exact' })

  // Horizontal Row Filtering: https://postgrest.org/en/v12/references/api/tables_views.html#horizontal-filtering
  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_SEARCH_KEYS.includes(key)) {
      const { operator, operand } = extractOperandAndOperatorFilter(value)
      query = query.filter(key, operator, operand)
    }
  }

  // Ordering By: https://postgrest.org/en/v12/references/api/tables_views.html#ordering
  const orderEntries = orderParamToOrderOptions(orderParam)
  for (const [column, options] of orderEntries) {
    if (column) {
      query = query.order(column, options)
    }
  }

  if (cursor) {
    const { operator, operand } = extractOperandAndOperatorCursor(cursor)

    if (operator === 'or') {
      query = query.or(operand)
    } else {
      throw new Error('Invalid cursor')
    }
  }

  const { data, count } = await query.limit(limit || 10)

  let next_cursor: typeof cursor = null
  let prev_cursor: typeof cursor = null

  if (!!data && data.length > 0) {
    const firstItem = data[0]
    prev_cursor = getPrevCursor(orderEntries, firstItem)

    if (data.length >= limit) {
      const lastItem = data[data.length - 1]
      next_cursor = getNextCursor(orderEntries, lastItem)
    }
  }

  return NextResponse.json({ data, prev_cursor, next_cursor, count })
}

export async function POST(request: Request) {
  const supabase = await apiKey(request)
  const params = await request.json()
  await validatePost(params)

  const { amount, ...item } = params

  const { data } = await supabase
    .from('payment_intent')
    .insert({
      ...item,
      amount: convertToDecimal(amount),
      amount_e: 2,
      status: PAYMENT_INTENT_STATUS.REQUIRES_PAYMENT_METHOD,
    })
    .select('*')
    .throwOnError()
    .single()

  return NextResponse.json({ data })
}

export const validateGet = async (payload: zod.infer<typeof QuerySchema>) => {
  const validationResult = (await QuerySchema.safeParse(payload)) as { error?: string }

  if (validationResult.error) {
    throw new Error(validationResult.error)
  }
}

export const validatePost = async (payload: zod.infer<typeof FormSchema>) => {
  const validationResult = (await FormSchema.safeParse(payload)) as { error?: string }

  if (validationResult.error) {
    throw new Error(validationResult.error)
  }
}

const QuerySchema = zod.object({
  select: zod.string().optional(),
  order: zod.string().optional(),
  cursor: zod.string().optional(),
  limit: zod.number().optional(),
  status: zod.string().optional(), // status has DB index
  amount: zod.number().optional(), // amount has DB index
})

const FormSchema = zod.object({
  currency: zod.string(),
  amount: zod.number(),
  metadata: zod.object({}),
  customer: zod.string(),
  receipt_email: zod.string(),
})

import { type NextRequest, NextResponse } from 'next/server'
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
import { processAmountWithCurrency } from '@/lib/common'
import { createClientWithAuthHeader } from '@/utils/supabase/server'

// Change the dynamic behavior of a layout or page to fully static or fully dynamic. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'auto'
// Set the default revalidation time for a layout or page. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 0
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache
export const fetchCache = 'auto'

export async function GET(request: NextRequest) {
  const supabase = await createClientWithAuthHeader()
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
  const supabase = createClientWithAuthHeader()
  const params = await request.json()
  await validatePost(params)

  const { currency, ...item } = params
  const { amount, amount_e } = processAmountWithCurrency(item.amount, currency)

  const { data: account } = await supabase
    .from('business_account')
    .select('id, org_id')
    .limit(1)
    .single()

  const { data } = await supabase
    .from('payment_intent')
    .insert({
      ...item,
      currency,
      amount,
      amount_e,
      org_id: account?.org_id,
      account_id: account?.id,
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
  amount: zod.number().or(zod.string().nonempty()),
  metadata: zod.object({}),
  customer: zod.string(),
  receipt_email: zod.string(),
})

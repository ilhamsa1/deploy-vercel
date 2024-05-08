import { type NextRequest, NextResponse } from 'next/server'
import { z, ZodIssue } from 'zod'

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

export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  const supabase = await createClientWithAuthHeader()
  const searchParams = request.nextUrl.searchParams
  const { error: errorValidate } = (await validateGet(
    Object.fromEntries(searchParams.entries()),
  )) as {
    error: { name: string; message: ZodIssue[] }
  }
  // Security issue if duplicate key: ?select=status&status=requires_action&status=&select=

  if (errorValidate) {
    return NextResponse.json({ error: errorValidate })
  }

  // Select: ?select=fullName:full_name,birthDate:birth_date
  const select = searchParams.get('select') || '*'
  // Order By: `?order=age.desc,height.asc`
  const orderParam = searchParams.get('order') || ''
  const cursor = searchParams.get('cursor')
  const limit = parseInt(searchParams.get('limit') || '')

  // Vertical Column Filtering: https://postgrest.org/en/v12/references/api/tables_views.html#vertical-filtering
  let query = supabase
    .from('payment_intent')
    .select<typeof select, Record<string, unknown>>(select, { count: 'estimated' })

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

  const { data, count, error } = await query.limit(limit || 10)

  if (error) {
    return NextResponse.json({ error })
  }

  let next_cursor: typeof cursor = null
  let prev_cursor: typeof cursor = null

  if (!!data && data.length > 0) {
    const firstItem = data[0]
    prev_cursor = getPrevCursor(orderEntries, firstItem, 'id')

    if (data.length >= limit) {
      const lastItem = data[data.length - 1]
      next_cursor = getNextCursor(orderEntries, lastItem, 'id')
    }
  }

  return NextResponse.json({ data, prev_cursor, next_cursor, count })
}

export async function POST(request: Request) {
  const supabase = createClientWithAuthHeader()
  const params = await request.json()
  const { error: errorValidate } = (await validatePost(params)) as {
    error: { name: string; message: ZodIssue[] }
  }

  if (errorValidate) {
    return NextResponse.json({ error: errorValidate })
  }

  const { currency, ...item } = params
  const { amount, amount_e } = processAmountWithCurrency(item.amount, currency)

  const { data: account, error: errorAct } = await supabase
    .from('business_account')
    .select('id, org_id')
    .throwOnError()
    .limit(1)
    .single()

  if (errorAct) {
    return NextResponse.json({ error: errorAct })
  }

  const { data, error } = await supabase
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

  if (error) {
    return NextResponse.json({ error })
  }

  return NextResponse.json({ data })
}

export const validateGet = async (payload: z.infer<typeof QuerySchema>) => {
  try {
    await QuerySchema.parse(payload)
    return { error: null }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: {
          name: err.name,
          message: err.issues,
        },
      }
    }
  }
}

export const validatePost = async (payload: z.infer<typeof FormSchema>) => {
  try {
    await FormSchema.parse(payload)
    return { error: null }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: {
          name: err.name,
          message: err.issues,
        },
      }
    }
  }
}

const QuerySchema = z.object({
  select: z.string().optional(),
  order: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().optional(),
  status: z.string().optional(), // status has DB index
  amount: z.number().optional(), // amount has DB index
})

const FormSchema = z.object({
  currency: z.string({ required_error: 'currency is required' }),
  amount: z
    .number({ required_error: 'Amount is required' })
    .or(z.string({ required_error: 'Amount is required' }).nonempty()),
  metadata: z.object({}).optional(),
  customer: z.string().optional(),
  receipt_email: z.string().optional(),
})

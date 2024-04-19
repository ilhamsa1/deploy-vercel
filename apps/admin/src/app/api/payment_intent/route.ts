import { type NextRequest, NextResponse } from 'next/server'
import { apiKey } from '@/services/api-key'
import zod from 'zod'

import { type SupabaseClient } from '@supabase/supabase-js'

// interface OrderOpts {
//   ascending?: boolean
//   nullsFirst?: boolean
//   referencedTable?: undefined
// }

type PostgrestQueryBuilder<T> = ReturnType<SupabaseClient<T>['from']>
type PostgresFilterBuilder<T> = ReturnType<PostgrestQueryBuilder<T>['select']>
type OrderOpts<T = string> = Parameters<PostgresFilterBuilder<T>['order']>[1]

export function orderParamToOrderOptions(input: string) {
  return input.split(',').reduce<{ [key: string]: OrderOpts }>((acc, each) => {
    const [column, ...rest] = each.split('.')
    const opts: OrderOpts = {
      ascending: rest.includes('desc') ? false : true,
    }
    if (rest.includes('nullsfirst')) {
      opts.nullsFirst = true
    } else if (rest.includes('nullslast')) {
      opts.nullsFirst = false
    }
    acc[column] = opts
    return acc
  }, {})
}

const RESERVED_SEARCH_KEYS = [
  'select',
  'and',
  'not.and',
  'or',
  'not.or',
  'order',
  'cursor',
  'limit',
]

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
  let query = supabase.from('payment_intent').select('*')

  // Horizontal Row Filtering: https://postgrest.org/en/v12/references/api/tables_views.html#horizontal-filtering
  for (const [key, value] of searchParams.entries()) {
    if (!RESERVED_SEARCH_KEYS.includes(key)) {
      let [operator] = value.split('.', 1)
      if (operator === 'not') {
        operator = value.split('.', 2).join('.')
      }
      const operand = value.slice(operator.length + 1)
      query = query.filter(key, operator, operand)
    }
  }

  // Ordering By: https://postgrest.org/en/v12/references/api/tables_views.html#ordering
  const orderOptions = orderParamToOrderOptions(orderParam)
  for (const [column, options] of Object.entries(orderOptions)) {
    query = query.order(column, options)
  }

  // if (cursor) {
  //   query = query.or(Buffer.from(cursor, 'base64').toString('utf-8'))
  // }

  const { data } = await query.limit(limit || 10)

  let next_cursor: typeof cursor = null
  let prev_cursor: typeof cursor = null

  if (!!data && data.length > 0) {
    const firstItem = data[0]
    prev_cursor = Buffer.from(`and=(deleted_at.is.null, id.lt.${firstItem.id})`).toString('base64')

    if (data.length >= limit) {
      const lastItem = data[data.length - 1]

      let isIdColumnAsc = true
      const aConditions = []
      const bConditions = []
      for (const [column, options] of Object.entries(orderOptions)) {
        const isColumnAsc = options?.ascending || true
        if (column === 'id') {
          isIdColumnAsc = isColumnAsc
        }
        const columnValue = lastItem[column]
        aConditions.push(`${column}.${isColumnAsc ? 'gte' : 'lte'}.${columnValue}`)
        bConditions.push(`${column}.${isColumnAsc ? 'gt' : 'lt'}.${columnValue}`)
      }
      const aLast = `id.${isIdColumnAsc ? 'gt' : 'lt'}.${lastItem.id}`

      next_cursor = Buffer.from(
        // or=(and(a1, a2, a3, aLast), and(b1, b2, b3))
        `or=(and(${aConditions.join(',')},${aLast}),and(${bConditions.join(',')}))`,
      ).toString('base64')
    }
  }

  return NextResponse.json({ data, prev_cursor, next_cursor })
}

export async function POST(request: Request) {
  const supabase = await apiKey(request)
  const params = await request.json()
  await validatePost(params)

  const { data } = await supabase
    .from('payment_intent')
    .insert({ ...params, status: 'requires_payment_method' })
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
  amount: zod.string().optional(), // amount has DB index
})

const FormSchema = zod.object({
  currency: zod.string(),
  amount: zod.number(),
  metadata: zod.object({}),
  customer: zod.string(),
  receipt_email: zod.string(),
})

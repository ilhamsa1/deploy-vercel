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
type OrderEntries<T = string> = [key: string, val: OrderOpts<T>][]

export function orderParamToOrderOptions(input: string) {
  return input.split(',').reduce<OrderEntries>((acc, each) => {
    const [column, ...rest] = each.split('.')
    const opts: OrderOpts = {
      ascending: rest.includes('desc') ? false : true,
    }
    if (rest.includes('nullsfirst')) {
      opts.nullsFirst = true
    } else if (rest.includes('nullslast')) {
      opts.nullsFirst = false
    }
    acc.push([column, opts])
    return acc
  }, []) // acc is array of entries
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
  let query = supabase.from('payment_intent').select<typeof select, Record<string, unknown>>(select)

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
  const orderEntries = orderParamToOrderOptions(orderParam)
  for (const [column, options] of orderEntries) {
    query = query.order(column, options)
  }

  if (cursor) {
    const cursorPlain = Buffer.from(cursor, 'base64url').toString('utf-8')
    const [operator] = cursorPlain.split('=', 1)
    const operand = cursorPlain.slice(operator.length + 1)

    if (operator === 'or') {
      query = query.or(operand)
    } else {
      throw new Error('Invalid cursor')
    }
  }

  const { data } = await query.limit(limit || 10)

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

  return NextResponse.json({ data, prev_cursor, next_cursor })
}

export function getCursor(
  orderEntries: OrderEntries,
  firstOrlastItem: Record<string, unknown>,
  isNext: boolean,
) {
  // Assume id column is sorted ascending by default
  let isIdColumnAsc = true

  // Initialize accumulative and OR conditions for cursor creation
  const accEqConditions = []
  const accOrConditions = []

  // Loop over each order entry which defines column and sorting direction
  for (const [column, options] of orderEntries) {
    // Determine if the current column is sorted ascending, default is true
    const isColumnAsc = options?.ascending || true
    // Special handling if the column is 'id'
    if (column === 'id') {
      isIdColumnAsc = isColumnAsc
    }
    const columnValue = firstOrlastItem[column]

    // Construct a nested AND condition combining all previous EQ conditions, and add to OR conditions
    const andConditions = accEqConditions.slice() // copy array
    const operator: string = isNext ? (isColumnAsc ? 'gt' : 'lt') : isColumnAsc ? 'lt' : 'gt'
    andConditions.push(`${column}.${operator}.${columnValue}`)
    if (andConditions.length === 1) {
      accOrConditions.push(andConditions[0])
    } else {
      accOrConditions.push(`and(${andConditions.join(',')})`)
    }

    // Keep accumulating EQ conditions for each column
    accEqConditions.push(`${column}.eq.${columnValue}`)
  }

  // Construct the last part of cursor using the 'id' column's sort direction
  const lastCondition = `id.${isIdColumnAsc ? 'gt' : 'lt'}.${firstOrlastItem.id}`

  // Construct a nested AND condition combining all previous EQ conditions and add to OR conditions
  accOrConditions.push(`and(${accEqConditions.join(',')},${lastCondition})`)

  // Combine OR conditions to construct the cursor
  return Buffer.from(
    // or=(c1, and(eq1, c2), and(eq1, eq2, c3), and(eq1, eq2, eq3, cId))
    `or=(${accOrConditions.join(',')})`,
  ).toString('base64url')
}

export function getNextCursor(orderEntries: OrderEntries, lastItem: Record<string, unknown>) {
  return getCursor(orderEntries, lastItem, true)
}

export function getPrevCursor(orderEntries: OrderEntries, firstItem: Record<string, unknown>) {
  return getCursor(orderEntries, firstItem, false)
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

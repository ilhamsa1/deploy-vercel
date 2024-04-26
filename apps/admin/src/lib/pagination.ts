import { type SupabaseClient } from '@supabase/supabase-js'
import { removeParentheses } from './common'

type PostgrestQueryBuilder<T> = ReturnType<SupabaseClient<T>['from']>
type PostgresFilterBuilder<T> = ReturnType<PostgrestQueryBuilder<T>['select']>
type OrderOpts<T = string> = Parameters<PostgresFilterBuilder<T>['order']>[1]
type OrderEntries<T = string> = [key: string, val: OrderOpts<T>][]

export const RESERVED_SEARCH_KEYS = [
  'select',
  'and',
  'not.and',
  'or',
  'not.or',
  'order',
  'cursor',
  'limit',
]

export function extractOperandAndOperatorFilter(value: string) {
  let [operator] = value.split('.', 1)
  if (operator === 'not') {
    operator = value.split('.', 2).join('.')
  }
  const operand = value.slice(operator.length + 1)
  return { operator, operand }
}

export function extractOperandAndOperatorCursor(cursor: string) {
  const cursorPlain = Buffer.from(cursor, 'base64url').toString('utf-8')
  const [operator] = cursorPlain.split('=', 1)
  const operand = removeParentheses(cursorPlain.slice(operator.length + 1))
  return { operator, operand }
}

// Horizontal Row Filtering: https://postgrest.org/en/v12/references/api/tables_views.html#horizontal-filtering
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

export function getCursor(
  orderEntries: OrderEntries,
  firstOrlastItem: Record<string, unknown>,
  isNext: boolean,
  keyId: string,
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
    if (column === keyId) {
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
  const lastCondition = `${keyId}.${isIdColumnAsc ? 'gt' : 'lt'}.${firstOrlastItem[keyId]}`

  // Construct a nested AND condition combining all previous EQ conditions and add to OR conditions
  accOrConditions.push(`and(${accEqConditions.join(',')},${lastCondition})`)

  // Combine OR conditions to construct the cursor
  return Buffer.from(
    // or=(c1, and(eq1, c2), and(eq1, eq2, c3), and(eq1, eq2, eq3, cId))
    `or=(${accOrConditions.join(',')})`,
  ).toString('base64url')
}

export function getNextCursor(
  orderEntries: OrderEntries,
  lastItem: Record<string, unknown>,
  keyId: string,
) {
  return getCursor(orderEntries, lastItem, true, keyId)
}

export function getPrevCursor(
  orderEntries: OrderEntries,
  firstItem: Record<string, unknown>,
  keyId: string,
) {
  return getCursor(orderEntries, firstItem, false, keyId)
}

import { amountCurrency } from './constant'

export const computeMutation = <T extends Record<string, unknown>>(
  newRow: T,
  oldRow: T,
): boolean => {
  const keys = Object.keys(newRow)

  return keys.some((key) => newRow[key] !== oldRow[key])
}

export type ResponseData<T> = {
  data: T[]
  count: number
  status: number
  error: any
  next_cursor: string
  prev_cursor: string
  has_next_page: boolean
}

export function processAmountWithCurrency(amount: number | string, currency: string) {
  let amount_e = 2 // Default to 2 decimal places

  if (typeof amount === 'string') {
    // Split the input string into whole and fractional parts
    const [amount_w, amount_f = '00'] = amount.split('.', 2)
    const formattedFractional = (amount_f + '0').substring(0, 2) // Ensure two decimal places

    // Format amount as a string with two decimal places
    amount = `${amount_w}${formattedFractional}`
    amount_e = formattedFractional.length // Update to reflect the actual length of formattedFractional
  } else {
    // For non-string input, fetch the default fractional digits for the currency
    amount_e = amountCurrency[currency.toLowerCase()]?.fractionDigits ?? 2 // Default to 2 if undefined
  }

  return { amount, amount_e }
}

export function removeParentheses(str: string) {
  if (str.startsWith('(') && str.endsWith(')')) {
    return str.substring(1, str.length - 1)
  }
  return str
}

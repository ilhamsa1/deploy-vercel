import { amountCurrency } from './constant'

export const computeMutation = <T extends Record<string, unknown>>(
  newRow: T,
  oldRow: T,
): boolean => {
  const keys = Object.keys(newRow)

  return keys.some((key) => newRow[key] !== oldRow[key])
}

export type ResponseData<T> = { data: T[]; count?: number; status: number; error: any }

export function processAmountWithCurrency(amount: number | string, currency: string) {
  let amount_e = 2

  if (typeof amount === 'string') {
    const [amount_w, amount_f] = amount.split('.', 2)
    amount_e = amount_f.length
    amount = +`${amount_w}${amount_f}`
  } else {
    amount_e = amountCurrency[currency.toLowerCase()]?.fractionDigits
  }

  return { amount, amount_e }
}

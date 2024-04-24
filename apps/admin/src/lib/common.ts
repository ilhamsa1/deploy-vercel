import { PaginationParam } from '@/interfaces'

export const computeMutation = <T extends Record<string, unknown>>(
  newRow: T,
  oldRow: T,
): boolean => {
  const keys = Object.keys(newRow)

  return keys.some((key) => newRow[key] !== oldRow[key])
}

export type ResponseData<T> = { data: T[]; count?: number; status: number; error: any }

export function convertToDecimal(amount: number) {
  return (amount / 100).toFixed(2)
}

export const calculatePageAndPageSize = ({ page, pageSize }: PaginationParam) => {
  const currentPage = Number(page) === 0 ? 1 : Number(page)
  const pageLimit = Number(pageSize)

  const from = (currentPage - 1) * pageLimit
  const to = currentPage * pageLimit - 1

  return { from, to }
}

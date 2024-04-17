export const computeMutation = <T extends Record<string, unknown>>(
  newRow: T,
  oldRow: T,
): boolean => {
  const keys = Object.keys(newRow)

  return keys.some((key) => newRow[key] !== oldRow[key])
}

export type ResponseData<T> = { data: T[]; count?: number; status: number; error: any }

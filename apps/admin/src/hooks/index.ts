'use client'

import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const useDebounceFn = () => {
  const [timeoutId, setTimeoutId] = useState(-1)

  const debounce = async <T>(fn: () => Promise<T> | T, timeoutDuration = 500): Promise<T> => {
    return await new Promise((resolve) => {
      if (timeoutId !== -1) {
        clearTimeout(timeoutId)
      }

      const newId = window.setTimeout(() => {
        const result = fn()
        resolve(result)
      }, timeoutDuration)

      setTimeoutId(newId)
    })
  }

  return { debounce }
}

export function useDialogShowState() {
  const [openDialog, setOpenDialog] = useState(false)

  const onOpenDialog = () => setOpenDialog(true)
  const onCloseDialog = () => setOpenDialog(false)

  return { openDialog, onOpenDialog, onCloseDialog }
}

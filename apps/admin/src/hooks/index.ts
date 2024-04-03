'use client'

import { useEffect, useMemo, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'

import { createClient } from '../utils/supabase/client'

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

/**
 * Wrap the createClient in a useMemo hook to prevent the client from being recreated on every render
 *
 * @returns {SupabaseClient} The memoized Supabase client instance.
 */
export const useSupabase = (): SupabaseClient => {
  return useMemo(createClient, [])
}

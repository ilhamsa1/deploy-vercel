'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SupabaseClient } from '@supabase/supabase-js'
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'

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

export function useDialogShowState<T>() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selected, setSelected] = useState<T>()

  const onOpenDialog = useCallback(
    (data?: T) => {
      setOpenDialog(true)
      if (data) setSelected(data)
    },
    [setOpenDialog],
  )

  const onCloseDialog = useCallback(() => setOpenDialog(false), [setOpenDialog])

  return { openDialog, onOpenDialog, onCloseDialog, selected }
}

/**
 * Wrap the createClient in a useMemo hook to prevent the client from being recreated on every render
 *
 * @returns {SupabaseClient} The memoized Supabase client instance.
 */
export const useSupabase = (): SupabaseClient => {
  return useMemo(createClient, [])
}

export function usePaginationCursor(
  paginationModel: GridPaginationModel,
  originPaginationModel: GridPaginationModel,
  sortModel: GridSortModel,
) {
  const mapPageToCursors = useRef<{ [page: number]: [string | null, string | null] }>({})

  // Reset mapPageToCursors if sortModel or pageSize changed
  useEffect(() => {
    mapPageToCursors.current = {}
  }, [sortModel, paginationModel.pageSize])

  const originPage = originPaginationModel.page
  const currentPage = paginationModel.page

  const cursor = useMemo<string | undefined>(() => {
    const prevPage = currentPage - 1
    const nextPage = currentPage + 1

    // Get cursors to current page
    const [, nextCursor] = mapPageToCursors.current[prevPage] || []
    const [prevCursor] = mapPageToCursors.current[nextPage] || []

    let _cursor = ''
    if (currentPage > originPage) {
      // Handle special case when nextCursor is null, because
      // someone emptied the previous page, while we are paginating.
      // Use prev_cursor from next page instead.
      _cursor = nextCursor || prevCursor || ''
    } else if (currentPage < originPage) {
      // Handle special case when prevCursor is null, because
      // someone emptied the next page, while we are paginating.
      // Use next_cursor from previous page instead.
      _cursor = prevCursor || nextCursor || ''
    } else if (currentPage === originPage) {
      // Prefer nextCursor, if only pageSize was changed, so first item in page is static.
      _cursor = ''
    }

    return _cursor
  }, [originPage, currentPage])

  const getPageCursors = useCallback((page: number, isStrict = true) => {
    const pageCursors = mapPageToCursors.current[page]
    if (pageCursors === undefined || isStrict) {
      return pageCursors
    }

    let [prevCursor, nextCursor] = pageCursors || []
    if (!prevCursor && !nextCursor) {
      const pageNumbers = Object.keys(mapPageToCursors.current).map((k) => +k)
      const pageWithPrevCursor =
        pageNumbers.filter((p) => p > page).find((p) => mapPageToCursors.current[p][0]) || 0
      const pageWithNextCursor =
        pageNumbers.filter((p) => p < page).find((p) => mapPageToCursors.current[p][1]) || 0
      prevCursor = mapPageToCursors.current[pageWithPrevCursor]?.[0]
      nextCursor = mapPageToCursors.current[pageWithNextCursor]?.[1]
    }

    return [prevCursor, nextCursor]
  }, [])

  const setPageCursors = useCallback(
    (page: number, prevCursor: string | undefined, nextCursor: string | undefined) => {
      // Use setCursors() after query...
      // setting prevCursor to null (or empty string) if page is empty
      // setting nextCursor to null (or empty string) if page is empty
      mapPageToCursors.current[page] = [prevCursor || null, nextCursor || null]
    },
    [],
  )

  return { cursor, getPageCursors, setPageCursors, mapPageToCursors }
}

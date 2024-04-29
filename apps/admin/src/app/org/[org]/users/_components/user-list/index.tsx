'use client'

import Box from '@mui/material/Box'
import { ChangeEvent, useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { GridPaginationModel, GridSortModel } from '@mui/x-data-grid'

import { useDebounceFn, useDialogShowState, usePaginationCursor } from '@/hooks'
import { UserListT } from '@/models/organizations/types'

import Filters from './_components/filters'
import Datagrid from './_components/datagrid'
import DialogAdd from './_components/dialog/add'

import { getUserList } from './actions'

const UserList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [data, setData] = useState<UserListT[]>([])
  const [hasNextPage, setHasNextPage] = useState<boolean>(false)

  const [searchDisplayName, setSearchDisplayName] = useState('')
  const [estimatedRowCount, setEstimatedRowCount] = useState(0)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'asc' }])
  const [originPaginationModel, setOriginPaginationModel] = useState(paginationModel)
  const { cursor, getPageCursors, setPageCursors } = usePaginationCursor(
    paginationModel,
    originPaginationModel,
    sortModel,
  )

  const [isLoading, startTransition] = useTransition()

  const { debounce } = useDebounceFn()

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      setSearchDisplayName(`${e.target.name}=ilike.%${e.target.value}%`)
    })
  }, [])

  const queryOptions = useMemo(() => {
    return {
      cursor,
      pageSize: paginationModel.pageSize,
      sortModel,
      search: searchDisplayName,
    }
  }, [paginationModel, sortModel, searchDisplayName])

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        // Do query with cursor and pageSize
        const res = await getUserList(queryOptions)
        // // Update cursors after query (even if res.data is empty)
        setPageCursors(paginationModel.page, res?.prev_cursor, res?.next_cursor)
        if (!res) return

        // After cursors updated...
        // if changing page and no items/rows in result, redirect back to origin page.
        if (paginationModel.page !== originPaginationModel.page && res.data.length === 0) {
          // This is skipped, if the first page is empty (on initial load).
          // This is also skipped, if the current page becomes empty (on reload).
          setPaginationModel(originPaginationModel)
          // This redirect is required if the next page becomes empty,
          // or if the previous page becomes empty,
          // while we are paginating.
        }
        setHasNextPage(res.has_next_page || false)
        setEstimatedRowCount((count) => (count ? count : res.count))

        if (!res?.data.length) return
        setData(res.data as UserListT[])
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  // <DataGrid onPaginationModelChange={handlePaginationModelChange} ... />
  // This handler is called when the next page button is pressed
  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      const currentPage = paginationModel.page
      const targetPage = newPaginationModel.page

      const [, nextCursor] = getPageCursors(targetPage - 1, true) || []
      const [prevCursor] = getPageCursors(targetPage + 1, true) || []

      if ((targetPage > currentPage && nextCursor) || prevCursor) {
        // If we have the next_cursor, we can allow the page to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else if ((targetPage < currentPage && prevCursor) || nextCursor) {
        // If we have the prev_cursor, we can allow the page to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else if (targetPage === currentPage) {
        // If page not changed, we allow only the pageSize to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else {
        // Else, ignore the change.
        setPaginationModel({ ...paginationModel }) // trigger reload the same page
      }
    },
    [paginationModel, setPaginationModel, setOriginPaginationModel, getPageCursors],
  )

  useEffect(() => {
    fetchUsers()
  }, [queryOptions])

  return (
    <Box>
      <Filters
        searchDisplayName={searchDisplayName || ''}
        handleChange={handleChange}
        onOpenDialog={onOpenDialog}
        onReload={fetchUsers}
      />
      <Datagrid
        isLoading={isLoading}
        users={data}
        paginationModel={paginationModel}
        handlePaginationModelChange={handlePaginationModelChange}
        setSortModel={setSortModel}
        hasNextPage={hasNextPage}
        totalRowCount={estimatedRowCount}
      />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

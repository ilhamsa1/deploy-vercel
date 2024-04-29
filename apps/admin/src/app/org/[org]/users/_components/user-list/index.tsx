'use client'

import Box from '@mui/material/Box'
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import toast from 'react-hot-toast'
import { GridSortModel } from '@mui/x-data-grid'

import { useDebounceFn, useDialogShowState, usePreviousPage } from '@/hooks'
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
  const mapPageToCursors = useRef<{ [page: number]: [string, string] }>({})

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 1,
  })
  const prevPage = usePreviousPage(paginationModel)
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'desc' }])

  const [isLoading, startTransition] = useTransition()

  const { debounce } = useDebounceFn()

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      setSearchDisplayName(`${e.target.name}=ilike.%${e.target.value}%`)
    })
  }, [])

  const queryOptions = useMemo(() => {
    const currentPage = paginationModel.page
    const [_prev_cursor, next_cursor] = mapPageToCursors.current[currentPage - 1] || []
    return {
      cursor: next_cursor || '',
      pageSize: paginationModel.pageSize,
      sortModel,
      search: searchDisplayName,
    }
  }, [prevPage, paginationModel, sortModel, searchDisplayName])

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        const res = await getUserList(queryOptions)
        if (!res) return
        mapPageToCursors.current[paginationModel.page] = [res.prev_cursor, res.next_cursor]
        setHasNextPage(res.has_next_page || false)
        setEstimatedRowCount((count) => (count ? count : res.count))

        if (!res?.data.length) return
        setData(res.data as UserListT[])
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

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
        setPaginationModel={setPaginationModel}
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

'use client'

import Box from '@mui/material/Box'
import { ChangeEvent, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { GridSortModel } from '@mui/x-data-grid'

import { useDebounceFn, useDialogShowState } from '@/hooks'
import { UserListT } from '@/models/organizations/types'
import { sortModelArrayToString } from '@/lib/common'

import Filters from './_components/filters'
import Datagrid from './_components/datagrid'
import DialogAdd from './_components/dialog/add'

import { getUserList } from './actions'

const UserList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [data, setData] = useState<UserListT[]>([])
  const [count, setCount] = useState<number>(0)
  const [nextCursor, setNextCursor] = useState<string>('')
  const [hasNextPage, setHasNextPage] = useState<string>('')

  const [searchDisplayName, setSearchDisplayName] = useState('')
  const mapPageToNextCursor = useRef<{ [page: number]: string }>({})

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'created_at', sort: 'asc' }])
  const [isLoading, startTransition] = useTransition()

  const { debounce } = useDebounceFn()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || ''
    debounce(() => {
      setSearchDisplayName(newValue)
    })
  }

  const queryOptions = useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[paginationModel.page - 1] || '',
      pageSize: paginationModel.pageSize,
      sortModel: sortModelArrayToString(sortModel) || '',
    }),
    [paginationModel, sortModel],
  )

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        const res = await getUserList(queryOptions)
        if (!res?.data.length) return
        setData(res.data as UserListT[])
        setCount(res.count || 0)
        setNextCursor(res.next_cursor || '')
        setHasNextPage(res.prev_cursor || '')
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [queryOptions])

  useEffect(() => {
    if (!isLoading && nextCursor) {
      // We add nextCursor when available
      mapPageToNextCursor.current[paginationModel.page] = nextCursor
    }
  }, [paginationModel.page, isLoading, nextCursor])

  return (
    <Box>
      <Filters
        searchDisplayName={searchDisplayName || ''}
        onOpenDialog={onOpenDialog}
        handleChange={handleChange}
      />
      <Datagrid
        isLoading={isLoading}
        users={data}
        totalRowCount={count}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        setSortModel={setSortModel}
        hasNextPage={hasNextPage}
      />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

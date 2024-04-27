'use client'

import Box from '@mui/material/Box'
import { ChangeEvent, useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

import { useDebounceFn, useDialogShowState } from '@/hooks'
import { UserListT } from '@/models/organizations/types'
import Filters from './_components/filters'
import Datagrid from './_components/datagrid'
import DialogAdd from './_components/dialog/add'

import { getUserList } from './actions'
import { PaginationParam } from '@/interfaces'

const UserList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [data, setData] = useState<UserListT[]>([])
  const [count, setCount] = useState<number>(0)
  const [paramsModel, setParamsModel] = useState<PaginationParam & { searchDisplayName?: string }>({
    page: 1,
    pageSize: 10,
    searchDisplayName: '',
  })
  const [isLoading, startTransition] = useTransition()

  const { debounce } = useDebounceFn()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value || ''
    debounce(() => {
      setParamsModel((prev) => ({ ...prev, searchDisplayName: newValue }))
    })
  }

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        const res = await getUserList(paramsModel)
        if (!res?.data.length) return
        setData(res.data as UserListT[])
        setCount(res.count || 0)
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [paramsModel])

  return (
    <Box>
      <Filters
        searchDisplayName={paramsModel.searchDisplayName || ''}
        onOpenDialog={onOpenDialog}
        handleChange={handleChange}
      />
      <Datagrid
        isLoading={isLoading}
        users={data}
        count={count}
        paginationModel={paramsModel}
        setPaginationModel={setParamsModel}
      />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

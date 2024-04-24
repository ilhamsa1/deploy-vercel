'use client'

import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

import { useDialogShowState } from '@/hooks'
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
  const [paginationModel, setPaginationModel] = useState<PaginationParam>({
    page: 1,
    pageSize: 10,
  })
  const [isLoading, startTransition] = useTransition()

  const fetchUsers = () => {
    startTransition(async () => {
      try {
        const res = await getUserList(paginationModel)
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
  }, [paginationModel])

  return (
    <Box>
      <Filters onOpenDialog={onOpenDialog} />
      <Datagrid
        isLoading={isLoading}
        users={data}
        count={count}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
      />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

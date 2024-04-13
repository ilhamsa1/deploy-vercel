import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'

import { useDialogShowState } from '@/hooks'
import { UserListT } from '@/models/organizations/types'
import Filters from './_components/filters'
import Datagrid from './_components/datagrid'
import DialogAdd from './_components/dialog/add'

import { getUserList } from './actions'

const UserList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [users, setUsers] = useState<UserListT[]>([])
  const [count, setCount] = useState<number>(0)
  const [isLoading, startTransition] = useTransition()

  const fetchUsers = () => {
    startTransition(async () => {
      const res = await getUserList()
      if (!res) return
      setUsers(res.data as UserListT[])
      setCount(res.count || 0)
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Box>
      <Filters onOpenDialog={onOpenDialog} />
      <Datagrid
        isLoading={isLoading}
        users={users}
        count={count}
      />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

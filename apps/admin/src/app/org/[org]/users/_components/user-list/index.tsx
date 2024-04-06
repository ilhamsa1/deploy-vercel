'use client'

import Box from '@mui/material/Box'
import Filters from './_components/filters'
import Datagrid from './_components/datagrid'
import DialogAdd from './_components/dialog/add'
import { useDialogShowState } from '@/hooks'

const UserList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  return (
    <Box>
      <Filters onOpenDialog={onOpenDialog} />
      <Datagrid />
      <DialogAdd
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default UserList

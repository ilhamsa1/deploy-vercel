import Box from '@mui/material/Box'
import Filters from './_components/filters'
import Datagrid from './_components/datagrid'

import DialogAcceptRequestUser from './_components/dialog/accept-request'

import { useDialogShowState } from '@/hooks'

const JoinRequest = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()

  return (
    <Box>
      <Filters />
      <Datagrid onOpenDialog={onOpenDialog} />
      <DialogAcceptRequestUser
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default JoinRequest

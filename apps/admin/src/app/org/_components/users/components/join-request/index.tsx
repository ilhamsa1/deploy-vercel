import Box from '@mui/material/Box'
import Filters from './components/filters'
import Datagrid from './components/datagrid'

import DialogAcceptRequestUser from './components/dialog/accept-request'

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

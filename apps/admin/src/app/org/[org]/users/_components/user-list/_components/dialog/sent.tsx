import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ComponentType } from 'react'

import Dialog from '@/components/dialog'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogInviteUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={onCloseDialog}
      title="Add User"
      fullWidth
    >
      <Stack
        direction="column"
        textAlign="center"
      >
        <Typography variant="body1">Your invitation has been sent to email</Typography>
        <Typography
          fontWeight="bold"
          variant="body1"
        >
          mcjordan@org.co
        </Typography>
      </Stack>
    </Dialog>
  )
}

export default DialogInviteUser

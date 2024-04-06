import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ComponentType } from 'react'

import Dialog from '@/components/dialog'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogAddedRequestUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  return (
    <Dialog
      open={openDialog}
      onClose={onCloseDialog}
      title="Added Request"
      fullWidth
    >
      <Stack
        direction="column"
        textAlign="center"
      >
        <Typography variant="body1">
          User <strong>mcjordan@org.co</strong> has been added as Admin
        </Typography>
      </Stack>
    </Dialog>
  )
}

export default DialogAddedRequestUser

import { ComponentType, useTransition } from 'react'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'

import Dialog from '@/components/dialog'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogAddWebHook: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const [isLoading, startTransition] = useTransition()

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        onCloseDialog()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Error'
        toast.error(message)
      }
    })
  }

  return (
    <Dialog
      open={openDialog}
      onAccept={onSubmit}
      onClose={onCloseDialog}
      title="Add endpoint"
      acceptLabel="Add endpoint"
      loadingButton={isLoading}
      fullWidth
    >
      <Typography variant="caption">Endpoint.</Typography>
    </Dialog>
  )
}

export default DialogAddWebHook

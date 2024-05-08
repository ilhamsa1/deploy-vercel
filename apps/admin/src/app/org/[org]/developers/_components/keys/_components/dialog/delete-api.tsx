import { ComponentType, useTransition } from 'react'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'

import Dialog from '@/components/dialog'

import { revokeKey } from '../../actions'
import { Keys } from '../..'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  fetchApiKeys: () => void
  selectedDeleteKey: Keys
}

const DialogDeleteApiKey: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  fetchApiKeys,
  selectedDeleteKey,
}) => {
  const [isLoading, startTransition] = useTransition()

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        const res = await revokeKey(selectedDeleteKey.id)
        if (!res) return
        onCloseDialog()
        fetchApiKeys()
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
      title="Delete Confirmation"
      acceptLabel="Delete"
      loadingButton={isLoading}
      cancelButton
      fullWidth
    >
      <Typography variant="caption">
        Access key will be deleted. Make sure you know what you're doing.
      </Typography>
    </Dialog>
  )
}

export default DialogDeleteApiKey

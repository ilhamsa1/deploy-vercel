import { ComponentType, useTransition } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import { User } from '@supabase/supabase-js'

import Dialog from '@/components/dialog'

import { WebHookListT } from '@/models/web-hooks/types'
import { deleteWebHooksById } from '../actions'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  webhook: WebHookListT
  user?: User
}

const DialogDeleteWebHook: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  webhook,
  user,
}) => {
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        await deleteWebHooksById(webhook?.id)
        onCloseDialog()
        router.push(`/org/${user?.user_metadata.org.tag}/developers`)
        toast.success('Endpoints deleted successfully')
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
      title="Delete Webhook"
      acceptLabel="Delete"
      loadingButton={isLoading}
      fullWidth
      cancelButton
    >
      <Typography>
        After deleting this endpoint no future webhook will be sent to its URL.
      </Typography>
    </Dialog>
  )
}

export default DialogDeleteWebHook

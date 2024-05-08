import { ComponentType, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Dialog from '@/components/dialog'

import { FormSchemaWebHooks } from '@/components/event/schema'
import FormWebHook from '@/components/event/form'
import { WebHookListT } from '@/models/web-hooks/types'
import { updateWebHooksById } from '../actions'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  webhook: WebHookListT
  fetchWebhooksById: () => void
}

const DialogEditWebHook: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  webhook,
  fetchWebhooksById,
}) => {
  const [isLoading, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchemaWebHooks>>({
    resolver: zodResolver(FormSchemaWebHooks),
    values: webhook as z.infer<typeof FormSchemaWebHooks>,
  })

  const handleClose = () => {
    onCloseDialog()
    form.reset({
      url: '',
      description: '',
      api_version: '',
      enabled_events: [],
    })
  }

  const onSubmit = async (data: z.infer<typeof FormSchemaWebHooks>) => {
    startTransition(async () => {
      try {
        await updateWebHooksById({ id: webhook?.id, data })
        handleClose()
        fetchWebhooksById()
        toast.success('Endpoints updated successfully')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Error'
        toast.error(message)
      }
    })
  }

  return (
    <Dialog
      open={openDialog}
      onAccept={form.handleSubmit(onSubmit)}
      onClose={handleClose}
      title="Edit endpoint"
      acceptLabel="Edit endpoint"
      loadingButton={isLoading}
      fullWidth
    >
      <FormWebHook formHook={form} />
    </Dialog>
  )
}

export default DialogEditWebHook

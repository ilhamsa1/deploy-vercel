import { ComponentType, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import Dialog from '@/components/dialog'

import { FormSchemaWebHooks } from '@/components/event/schema'
import FormWebHook from '@/components/event/form'

import { createWebHooks } from '../../actions'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  fetchWebHook: () => void
}

const DialogAddWebHook: ComponentType<Props> = ({ openDialog, onCloseDialog, fetchWebHook }) => {
  const [isLoading, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchemaWebHooks>>({
    resolver: zodResolver(FormSchemaWebHooks),
    defaultValues: {
      url: '',
      description: '',
      api_version: '',
      enabled_events: [],
    },
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
        const res = await createWebHooks(data)
        if (!res) return
        fetchWebHook()
        handleClose()
        toast.success('Endpoints saved successfully')
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
      title="Add endpoint"
      acceptLabel="Add endpoint"
      loadingButton={isLoading}
      fullWidth
    >
      <FormWebHook formHook={form} />
    </Dialog>
  )
}

export default DialogAddWebHook

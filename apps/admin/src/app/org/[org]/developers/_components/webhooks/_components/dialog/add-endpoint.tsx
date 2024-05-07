import { ComponentType, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Stack from '@mui/material/Stack'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'

import CheckboxGroupEvents from '@/components/event/checkbox-group'
import { FormSchemaWebHooks } from '@/components/event/schema'

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
      <Form {...form}>
        <Stack spacing={2}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="outlined"
                  label="Endpoint URL"
                  required
                  fullWidth
                  {...field}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="outlined"
                  label="Description"
                  fullWidth
                  {...field}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="api_version"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="outlined"
                  label="Payload Format Version"
                  fullWidth
                  {...field}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <CheckboxGroupEvents control={form?.control} />
        </Stack>
      </Form>
    </Dialog>
  )
}

export default DialogAddWebHook

'use client'
import { ComponentType, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useDialogShowState } from '@/hooks'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'

import DialogConfirmWithPassword from './confirm-with-password'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  fetchApiKeys: () => void
}

const FormSchema = z.object({
  description: z.string({ required_error: 'Description is required' }),
})

const DialogCreateApi: ComponentType<Props> = ({ openDialog, onCloseDialog, fetchApiKeys }) => {
  const {
    openDialog: openDialogConfirm,
    onCloseDialog: onCloseDialogConfirm,
    onOpenDialog: onOpenDialogConfirm,
  } = useDialogShowState()
  const [description, setDescription] = useState('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleClose = () => {
    onCloseDialog()
    form.reset({ description: '' })
  }

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setDescription(data.description)
    handleClose()
    onOpenDialogConfirm()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title="Generate API Key"
        onAccept={form.handleSubmit(onSubmit)}
        acceptLabel="Continue"
        fullWidth
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="outlined"
                  label="API key description"
                  fullWidth
                  {...field}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </Dialog>
      <DialogConfirmWithPassword
        description={description}
        openDialog={openDialogConfirm}
        onCloseDialog={onCloseDialogConfirm}
        fetchApiKeys={fetchApiKeys}
      />
    </>
  )
}

export default DialogCreateApi

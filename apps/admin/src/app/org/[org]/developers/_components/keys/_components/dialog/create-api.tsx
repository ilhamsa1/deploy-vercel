'use client'
import { ComponentType, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useDialogShowState } from '@/hooks'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'
import { User } from '@supabase/supabase-js'

import DialogConfirmWithPassword from './confirm-with-password'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  fetchApiKeys: () => void
  user?: User
}

const FormSchema = z.object({
  description: z.string().min(1, { message: 'Access key name is required' }),
})

const DialogCreateApi: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  fetchApiKeys,
  user,
}) => {
  const {
    openDialog: openDialogConfirm,
    onCloseDialog: onCloseDialogConfirm,
    onOpenDialog: onOpenDialogConfirm,
  } = useDialogShowState()
  const [description, setDescription] = useState('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
    },
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
        title="Generate Access Keys"
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
                  label="Access Key Name"
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
        user={user}
      />
    </>
  )
}

export default DialogCreateApi

import { ComponentType } from 'react'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'

import { FormField, FormItem, FormMessage, Form } from '@/components/form'

import DialogConfirmWithPassword from './confirm-with-password'
import { useDialogShowState } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const FormSchema = zod.object({
  description: zod.string(),
})

const DialogCreateApi: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogConfirm,
    onCloseDialog: onCloseDialogConfirm,
    onOpenDialog: onOpenDialogConfirm,
  } = useDialogShowState()

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: '',
    },
  })

  const onSubmit = (data: zod.infer<typeof FormSchema>) => {
    console.log(data)
    onCloseDialog()
    onOpenDialogConfirm()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Generate API Key"
        onAccept={form.handleSubmit(onSubmit)}
        acceptLabel="Generate"
        fullWidth
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="standard"
                  placeholder="API key description"
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
        openDialog={openDialogConfirm}
        onCloseDialog={onCloseDialogConfirm}
      />
    </>
  )
}

export default DialogCreateApi

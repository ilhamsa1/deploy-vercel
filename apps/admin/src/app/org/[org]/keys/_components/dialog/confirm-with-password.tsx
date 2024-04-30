import { ComponentType } from 'react'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { useDialogShowState } from '@/hooks'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'
import DialogSuccessCreated from './success-created'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const FormSchema = zod.object({
  password: zod.string(),
})

const DialogConfirmWithPassword: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogSuccess,
    onCloseDialog: onCloseDialogSuccess,
    onOpenDialog: onOpenDialogSucess,
  } = useDialogShowState()

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = (data: zod.infer<typeof FormSchema>) => {
    console.log(data)
    onCloseDialog()
    onOpenDialogSucess()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Password Confirmation"
        onAccept={form.handleSubmit(onSubmit)}
        acceptLabel="Confirm"
        fullWidth
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem style={{ width: '100%' }}>
                <TextField
                  variant="standard"
                  placeholder="Enter password"
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
      <DialogSuccessCreated
        openDialog={openDialogSuccess}
        onCloseDialog={onCloseDialogSuccess}
      />
    </>
  )
}

export default DialogConfirmWithPassword

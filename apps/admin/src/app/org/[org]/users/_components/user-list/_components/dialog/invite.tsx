import Stack from '@mui/material/Stack'
import { ComponentType, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import Typography from '@/components/typography'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'
import { useDialogShowState, useCopyClipboard } from '@/hooks'
import DialogSentInviteUser from './sent'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  inviteCode: string
}

const FormSchema = zod.object({
  email: zod.string().email(),
})

const DialogInviteUser: ComponentType<Props> = ({ openDialog, onCloseDialog, inviteCode }) => {
  const {
    openDialog: openDialogSentInvite,
    onCloseDialog: onCloseDialogSentInvite,
    onOpenDialog: onOpenDialogSentInvite,
  } = useDialogShowState()
  const [emailSend, setEmailSend] = useState('')
  const onCopyToClipboard = useCopyClipboard(inviteCode)

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: zod.infer<typeof FormSchema>) => {
    setEmailSend(data.email)
    onOpenDialogSentInvite()
    onCloseDialog()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Add User"
        fullWidth
      >
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction="column"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="caption">Invitation Code</Typography>
            <Typography variant="h2">{inviteCode}</Typography>
            <Typography
              onClick={onCopyToClipboard}
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              variant="caption"
            >
              Copy code
            </Typography>
          </Stack>
          <Typography variant="body1">or share invitation code via email</Typography>
          <Stack
            direction="row"
            spacing={1}
            width="100%"
          >
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem style={{ width: '100%' }}>
                    <TextField
                      variant="filled"
                      placeholder="example@gmail.com"
                      fullWidth
                      {...field}
                      type="email"
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              size="small"
              style={{ height: '48px' }}
              endIcon={<ArrowForwardIcon />}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Dialog>
      <DialogSentInviteUser
        openDialog={openDialogSentInvite}
        onCloseDialog={onCloseDialogSentInvite}
        emailSend={emailSend}
      />
    </>
  )
}

export default DialogInviteUser

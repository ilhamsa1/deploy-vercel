import Stack from '@mui/material/Stack'
import { ComponentType, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import zod from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import Typography from '@/components/typography'
import SelectRole from '@/components/select-role'

import { Form, FormField, FormItem, FormMessage } from '@/components/form'
import { useDialogShowState } from '@/hooks'

import DialogInviteUser from './invite'
import { inviteUser } from './actions'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogAddUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogInvite,
    onCloseDialog: onCloseDialogInvite,
    onOpenDialog: onOpenDialogInvite,
  } = useDialogShowState()
  const [inviteCode, setInviteCode] = useState('')

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      role: 'admin',
    },
  })

  const onSubmit = async (data: zod.infer<typeof FormSchema>) => {
    try {
      const response = await inviteUser(data)
      if (!response || !response.org) {
        throw new Error('Failed to invite organization')
      }

      setInviteCode(response.code)
      onOpenDialogInvite()
      onCloseDialog()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Error'
      toast.error(message)
    }
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Add User"
        fullWidth
        footer={
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              onClick={form.handleSubmit(onSubmit)}
              color="primary"
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon />}
            >
              Continue
            </Button>
          </Stack>
        }
      >
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography>Please select role that you want to assign to this user</Typography>
          <Form {...form}>
            <FormField
              control={form.control}
              name="role"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <SelectRole
                    value={value}
                    onChange={onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </Stack>
      </Dialog>
      <DialogInviteUser
        openDialog={openDialogInvite}
        onCloseDialog={onCloseDialogInvite}
        inviteCode={inviteCode}
      />
    </>
  )
}

const FormSchema = zod.object({
  role: zod.string(),
})

export default DialogAddUser

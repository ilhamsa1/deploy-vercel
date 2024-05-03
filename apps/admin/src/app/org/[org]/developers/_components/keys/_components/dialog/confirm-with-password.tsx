import { ComponentType, useState, useTransition } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import toast from 'react-hot-toast'

import { useDialogShowState } from '@/hooks'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'

import DialogSuccessCreated from './success-created'

import { securityConfirm } from '../../actions'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  description: string
  fetchApiKeys: () => void
}

const FormSchema = z.object({
  email: z
    .string({ required_error: 'Email is required ' })
    .email({ message: 'Please enter a valid email' }),
  password: z.string({ required_error: 'Password is required ' }),
  description: z.string(),
})

const DialogConfirmWithPassword: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  description,
  fetchApiKeys,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, startTransition] = useTransition()
  const {
    openDialog: openDialogSuccess,
    onCloseDialog: onCloseDialogSuccess,
    onOpenDialog: onOpenDialogSucess,
  } = useDialogShowState()
  const [accessKey, setAccessKey] = useState('')

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    values: {
      email: '',
      password: '',
      description,
    },
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleClose = () => {
    onCloseDialog()
    form.reset({ email: '', password: '', description: '' })
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      try {
        const res = await securityConfirm(data)
        if (!res) return
        setAccessKey(res)
        onOpenDialogSucess()
        handleClose()
        fetchApiKeys()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Error'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        title="Security Confirmation"
        footer={
          <Button
            fullWidth
            size="small"
            variant="contained"
            isLoading={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            Verify
          </Button>
        }
        fullWidth
      >
        <Form {...form}>
          <Stack spacing={3}>
            <Typography
              textAlign="center"
              variant="caption"
              fontWeight="bold"
            >
              We need an additional security check to authorize this action
            </Typography>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem style={{ width: '100%' }}>
                  <TextField
                    variant="outlined"
                    label="Email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <TextField
                    variant="outlined"
                    label="Password"
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </Stack>
        </Form>
      </Dialog>
      <DialogSuccessCreated
        accessKey={accessKey}
        description={description}
        openDialog={openDialogSuccess}
        onCloseDialog={onCloseDialogSuccess}
      />
    </>
  )
}

export default DialogConfirmWithPassword

'use client'
import { useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import zod from 'zod'

import toast from 'react-hot-toast'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/form'
import Button from '../../components/button'

import { login } from './actions'

const FormSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8, {
    message: 'Password is required.',
  }),
})

export default function LoginPage() {
  const [isLoading, startTransition] = useTransition()

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: zod.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await login(data)

      const { error } = JSON.parse(result)

      if (error?.message) {
        toast.error(error?.message)
      } else {
        toast.success('Successfully login')
      }
    })
  }

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack
              p={10}
              width={560}
              gap={6}
            >
              <Stack>
                <Typography variant="h2">Log In</Typography>
              </Stack>
              <Stack gap={2}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <TextField
                          variant="filled"
                          placeholder="example@gmail.com"
                          fullWidth
                          inputProps={{
                            style: { padding: '13px 16px' },
                          }}
                          InputProps={{
                            sx: { borderRadius: 0 },
                          }}
                          {...field}
                          type="email"
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <TextField
                          variant="filled"
                          placeholder="password"
                          fullWidth
                          inputProps={{
                            style: { padding: '13px 16px' },
                          }}
                          InputProps={{
                            sx: { borderRadius: 0 },
                          }}
                          {...field}
                          type="password"
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                >
                  Log In
                </Button>
              </Stack>
              <Divider />
            </Stack>
          </form>
        </Form>
      </Stack>
    </Container>
  )
}

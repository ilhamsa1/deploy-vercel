'use client'
import React, { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import zod from 'zod'

import toast from 'react-hot-toast'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import FilledInput from '@mui/material/FilledInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/form'
import Button from '../../components/button'
import Link from '../../components/link'

import { login, signup } from './actions'

import GoogleButton from '@/components/button/google-button'

const FormSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8, {
    message: 'Password is required.',
  }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, startTransition] = useTransition()

  const handleClickShowPassword = () => setShowPassword((show) => !show)

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
                        <FilledInput
                          placeholder="password"
                          fullWidth
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          }
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          onChange={field.onChange}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={<Checkbox />}
                    label="Remember me"
                  />
                  <Link href="/">
                    <Typography variant="body2">Forgot Password?</Typography>
                  </Link>
                </Stack>
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Log In
                </Button>
              </Stack>
              <Divider />
              <GoogleButton />
            </Stack>
          </form>
        </Form>
      </Stack>
    </Container>
  )
}

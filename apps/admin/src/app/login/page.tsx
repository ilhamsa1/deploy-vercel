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

// import AppleIcon from '@mui/icons-material/Apple'
// import GoogleIcon from '@mui/icons-material/Google'
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

import { login } from './actions'

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

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

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
                        <FilledInput
                          placeholder="password"
                          fullWidth
                          inputProps={{
                            style: { padding: '13px 16px' },
                          }}
                          sx={{
                            borderRadius: 0,
                          }}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
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
                  <Link
                    href="/"
                    withoutUnderline
                  >
                    <Typography variant="body2">Forgot Password?</Typography>
                  </Link>
                </Stack>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                >
                  Log In
                </Button>
              </Stack>
              {/* Will use buttons below to use provider oauth in the future
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                >
                  Log in with Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon />}
                >
                  Log in with Apple
                </Button>
              </Stack> */}
              <Divider />
            </Stack>
          </form>
        </Form>
      </Stack>
    </Container>
  )
}

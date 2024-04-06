'use client'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Stack } from '@mui/material'
import LogoutButton from '@/components/button/logout-button'
import Button from '@/components/button'
import zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/navigation'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/form'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { joinInviteCode } from './actions'

const OrgUserNotFound = () => {
  const router = useRouter()

  const form = useForm<zod.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: '',
    },
  })

  async function onSubmit(data: zod.infer<typeof FormSchema>) {
    try {
      const response = await joinInviteCode(data)
      if (!response || !response.org || !response.org.tag) {
        throw new Error('Failed to join organization')
      }

      const orgTag = response.org.tag
      toast.success('Successfully joined organization.')

      router.push(`/org/${orgTag}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Error'
      toast.error(message)
    }
  }

  return (
    <Container
      sx={{ my: 8 }}
      maxWidth="md"
    >
      <Typography
        variant="h2"
        gutterBottom
      >
        Join Organization
      </Typography>
      <Typography variant="body1">
        It appears you haven't registered with any organizations yet. Please reach out to your
        desired organization and request an invitation to join their portal.
      </Typography>
      <Stack sx={{ my: 2 }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invitation Code</FormLabel>
                  <FormControl>
                    <TextField
                      variant="outlined"
                      placeholder="Enter Invitation Code"
                      fullWidth
                      {...field}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Stack
              sx={{ maxWidth: 700, my: 4 }}
              direction="row"
              gap={2}
            >
              <LogoutButton />
              <Button
                variant="contained"
                size="small"
                type="submit"
              >
                Join Organization
              </Button>
            </Stack>
          </form>
        </Form>
      </Stack>
    </Container>
  )
}

const FormSchema = zod.object({
  code: zod.string(),
})

export default OrgUserNotFound

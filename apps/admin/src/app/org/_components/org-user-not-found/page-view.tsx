'use client'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Stack } from '@mui/material'
import LogoutButton from '@/components/button/logout-button'

const OrgUserNotFound = () => {
  return (
    <Container sx={{ my: 8 }}>
      <Typography
        variant="h2"
        gutterBottom
      >
        No Organizations Found
      </Typography>
      <Typography variant="body1">
        It appears you haven't registered with any organizations yet. Please reach out to your
        desired organization and request an invitation to join their portal.
      </Typography>
      <Stack sx={{ maxWidth: 200, py: 2 }}>
        <LogoutButton />
      </Stack>
    </Container>
  )
}

export default OrgUserNotFound

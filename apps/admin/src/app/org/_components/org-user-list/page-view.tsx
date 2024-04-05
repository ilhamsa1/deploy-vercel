'use client'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Stack } from '@mui/material'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const OrgUserList = () => {
  return (
    <Container sx={{ my: 8 }}>
      <Typography
        variant="h2"
        gutterBottom
      >
        Choose user organizations
      </Typography>
      <Typography variant="body1">
        Welcome to the Organization Selection Page. Here, you can browse and select the organization
        you are affiliated with or wish to join. Choose your organization to gain access to its
        resources, collaborate with members, and explore opportunities. Make your selection below to
        begin your journey within the community.
      </Typography>
      <Stack sx={{ my: 2, p: 2, background: '#fff' }}>
        <Stack divider={<Divider flexItem />}>
          {['majin', 'test'].map((org) => {
            return (
              <ListItemButton
                LinkComponent={Link}
                href={`/org/${org}`}
              >
                <ListItemText primary={org} />
              </ListItemButton>
            )
          })}
        </Stack>
      </Stack>
    </Container>
  )
}

export default OrgUserList

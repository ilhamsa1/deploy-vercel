'use client'

import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Stack } from '@mui/material'
import Divider from '@mui/material/Divider'
import Link from 'next/link'

import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ComponentType } from 'react'

interface Props {
  data: {
    role: string
    user_id: string
    org: {
      tag: string
    }[]
  }[]
}

const OrgUserList: ComponentType<Props> = ({ data }) => {
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
          {data.map((userOrg) => {
            // Note: fix supabase return object but the typing is array
            const org = userOrg.org as any
            return (
              <ListItemButton
                key={org.tag}
                LinkComponent={Link}
                href={`/org/${org.tag}`}
              >
                <ListItemText primary={org.tag} />
              </ListItemButton>
            )
          })}
        </Stack>
      </Stack>
    </Container>
  )
}

export default OrgUserList

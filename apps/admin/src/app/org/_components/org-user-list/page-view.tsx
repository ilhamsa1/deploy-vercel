'use client'

import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ComponentType, useEffect, useTransition } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { UserOrgT, OrgT } from '@/models/organizations/types'
import { chooseOrg } from './actions'

interface Props {
  data: UserOrgT[]
}

const OrgUserList: ComponentType<Props> = ({ data }) => {
  const [isLoading, startTransition] = useTransition()

  function onSelect(org: OrgT) {
    startTransition(async () => {
      const result = await chooseOrg(org)

      if (result.error?.message) {
        toast.error(result.error?.message)
        return
      }
      redirect(`/org/${org.tag}`)
    })
  }

  // Auto redirect user to org page if there is only 1 org
  // dont need to allow user to select
  useEffect(() => {
    if (data.length == 1) {
      onSelect(data[0].org)
    }
  }, [data])

  if (data.length == 1) return null

  return (
    <Container
      sx={{ my: 8 }}
      maxWidth="md"
    >
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
          {data.map(({ org }) => {
            if (!org) return null
            return (
              <ListItemButton
                key={org.tag}
                LinkComponent={Link}
                onClick={() => onSelect(org)}
                disabled={isLoading}
              >
                <ListItemText primary={org.display_name} />
              </ListItemButton>
            )
          })}
        </Stack>
      </Stack>
    </Container>
  )
}

export default OrgUserList

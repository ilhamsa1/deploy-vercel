'use client'

import Box from '@mui/material/Box'
import { useState, ComponentType } from 'react'

import UITabs from '@/components/tabs'

import UserList from '../user-list'
import JoinRequest from '../join-request'

interface Props {
  users: {
    role: string
    user_id: string
    created_at: string
    org: {
      tag: string
      display_name: string
    }[]
    user: {
      display_name: string
    }[]
  }[]
  count: number
}

const Tabs: ComponentType<Props> = ({ users, count }) => {
  const [value, setValue] = useState(0)

  return (
    <Box>
      <Box sx={{ margin: '1.25rem' }}>
        <UITabs
          value={value}
          labels={['User List', 'Joint Request']}
          handleChange={setValue}
        />
      </Box>
      {value === 0 && (
        <UserList
          users={users}
          count={count}
        />
      )}
      {value === 1 && <JoinRequest />}
    </Box>
  )
}

export default Tabs
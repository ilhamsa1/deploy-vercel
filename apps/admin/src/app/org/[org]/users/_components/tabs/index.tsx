'use client'

import Box from '@mui/material/Box'
import { useState, ComponentType } from 'react'

import UITabs from '@/components/tabs'

import UserList from '../user-list'
import JoinRequest from '../join-request'

const Tabs: ComponentType = () => {
  const [value, setValue] = useState(0)

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <UITabs
          value={value}
          labels={['User List', 'Join Request']}
          handleChange={setValue}
        />
      </Box>
      {value === 0 && <UserList />}
      {value === 1 && <JoinRequest />}
    </Box>
  )
}

export default Tabs

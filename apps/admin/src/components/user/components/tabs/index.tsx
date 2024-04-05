import Box from '@mui/material/Box'
import { useState } from 'react'

import UserList from '../user-list'
import JoinRequest from '../join-request'

import UITabs from '@/components/tabs'

const Tabs = () => {
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
      {value === 0 && <UserList />}
      {value === 1 && <JoinRequest />}
    </Box>
  )
}

export default Tabs

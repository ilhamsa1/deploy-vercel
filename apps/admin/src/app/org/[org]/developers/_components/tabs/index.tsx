'use client'

import { User } from '@supabase/supabase-js'
import Box from '@mui/material/Box'
import { useState } from 'react'

import UITabs from '@/components/tabs'

import AccessKeyList from '../keys'
import WebHookList from '../web-hook'

const Tabs = ({ user }: { user: User }) => {
  const [value, setValue] = useState(0)

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <UITabs
          value={value}
          labels={['API Keys', 'Web Hook']}
          handleChange={setValue}
        />
      </Box>
      {value === 0 && <AccessKeyList user={user} />}
      {value === 1 && <WebHookList />}
    </Box>
  )
}

export default Tabs

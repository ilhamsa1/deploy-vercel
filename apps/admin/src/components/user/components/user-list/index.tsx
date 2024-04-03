'use client'

import Box from '@mui/material/Box'
import Filters from './components/filters'
import Datagrid from './components/datagrid'

const UserList = () => {
  return (
    <Box>
      <Filters />
      <Datagrid />
    </Box>
  )
}

export default UserList

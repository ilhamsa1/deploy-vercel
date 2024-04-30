'use client'

import Box from '@mui/material/Box'

import SectionHeader from '../_components/header'
import SectionDatagrid from '../_components/datagrid'
import DialogCreateApi from '../_components/dialog/create-api'
import { useDialogShowState } from '@/hooks'
// import EmptyKeys from './_components/empty'

const KeysPage = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()

  return (
    <Box>
      <SectionHeader onOpenDialogCreateApi={onOpenDialog} />
      <SectionDatagrid />
      {/* <EmptyKeys /> */}
      <DialogCreateApi
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default KeysPage

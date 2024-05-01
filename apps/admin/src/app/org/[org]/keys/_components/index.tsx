'use client'

import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import { useCallback, useEffect, useState } from 'react'

import { useDialogShowState } from '@/hooks'

import SectionHeader from '../_components/header'
import SectionDatagrid from '../_components/datagrid'
import DialogCreateApi from '../_components/dialog/create-api'
import EmptyKeys from '../_components/empty'

import { getApiKeyList } from './actions'

const KeysPage = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [data, setData] = useState([])

  const fetchApiKeys = useCallback(async () => {
    try {
      const res = await getApiKeyList()
      if (!res.length) return
      setData(res)
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }, [])

  useEffect(() => {
    fetchApiKeys()
  }, [])

  return (
    <Box>
      {data.length ? (
        <>
          <SectionHeader onOpenDialogCreateApi={onOpenDialog} />
          <SectionDatagrid keys={data} />
        </>
      ) : (
        <EmptyKeys />
      )}
      <DialogCreateApi
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default KeysPage

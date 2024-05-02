'use client'

import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'

import { useDialogShowState } from '@/hooks'

import SectionHeader from '../_components/header'
import SectionDatagrid from '../_components/datagrid'
import DialogCreateApi from '../_components/dialog/create-api'
import DialogDeleteApi from '../_components/dialog/delete-api'
import EmptyKeys from '../_components/empty'

import { getApiKeyList } from './actions'

const KeysPage = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const {
    openDialog: openDeleteKeyDialog,
    onCloseDialog: onCloseDeleteKeyDialog,
    onOpenDialog: onOpenDeleteKeyDialog,
    selected: selectedDeleteKey,
  } = useDialogShowState()
  const [data, setData] = useState([])
  const [isLoading, startTransition] = useTransition()

  const fetchApiKeys = () => {
    startTransition(async () => {
      try {
        const res = await getApiKeyList()
        setData(res)
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchApiKeys()
  }, [])

  return (
    <Box>
      {data.length ? (
        <>
          <SectionHeader onOpenDialogCreateApi={onOpenDialog} />
          <SectionDatagrid
            onOpenDeleteKeyDialog={onOpenDeleteKeyDialog}
            isLoading={isLoading}
            keys={data}
          />
        </>
      ) : (
        <EmptyKeys onOpenDialogCreateApi={onOpenDialog} />
      )}
      <DialogCreateApi
        fetchApiKeys={fetchApiKeys}
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
      <DialogDeleteApi
        selectedDeleteKey={selectedDeleteKey}
        fetchApiKeys={fetchApiKeys}
        openDialog={openDeleteKeyDialog}
        onCloseDialog={onCloseDeleteKeyDialog}
      />
    </Box>
  )
}

export default KeysPage

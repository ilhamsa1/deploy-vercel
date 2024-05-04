'use client'

import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'

import { useDialogShowState } from '@/hooks'

import EmptyWebHook from './_components/empty'

export type Keys = {
  id: string
  description: string
  created_at: string
}

const KeysPage = () => {
  const {
    openDialog: openWebHookDialog,
    onCloseDialog: onCloseWebHookDialog,
    onOpenDialog: onOpenWebHookDialog,
  } = useDialogShowState()
  const [data, setData] = useState([])
  const [isLoading, startTransition] = useTransition()

  const fetchWebHook = () => {
    startTransition(async () => {
      try {
        setData([])
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchWebHook()
  }, [])

  return (
    <Box>
      <EmptyWebHook onOpenWebHookDialog={onOpenWebHookDialog} />
    </Box>
  )
}

export default KeysPage

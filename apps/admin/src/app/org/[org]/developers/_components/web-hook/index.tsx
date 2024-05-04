'use client'

import toast from 'react-hot-toast'
import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'

import { WebHookListT } from '@/models/web-hooks/types'
import { useDialogShowState } from '@/hooks'

import EmptyWebHook from './_components/empty'
import SectionHeader from './_components/header'
import SectionListWebHooks from './_components/datagrid'
import { getWebHooksList } from './actions'

export type Keys = {
  id: string
  description: string
  created_at: string
}

const WebHooksPage = () => {
  const {
    // openDialog: openWebHookDialog,
    // onCloseDialog: onCloseWebHookDialog,
    onOpenDialog: onOpenWebHookDialog,
  } = useDialogShowState()
  const [data, setData] = useState<WebHookListT[]>([])
  const [isLoading, startTransition] = useTransition()

  const fetchWebHook = () => {
    startTransition(async () => {
      try {
        const res = await getWebHooksList()
        setData(res?.data as WebHookListT[])
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
      {data.length ? (
        <>
          <SectionHeader onOpenWebHookDialog={onOpenWebHookDialog} />
          <SectionListWebHooks
            isLoading={isLoading}
            webHooks={data}
          />
        </>
      ) : (
        <EmptyWebHook onOpenWebHookDialog={onOpenWebHookDialog} />
      )}
    </Box>
  )
}

export default WebHooksPage

'use client'

import ContentDetails from '@/components/content-details'
import WrapperDetail from '@/components/wrapper-details'
import Stack from '@mui/material/Stack'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

import { useDialogShowState } from '@/hooks'
import { WebHookListT } from '@/models/web-hooks/types'

import { getWebHooksById } from './actions'
import DialogEditWebHook from './dialog/edit-endpoint'

export default function WebhooksDetail({ id }: { id: string }) {
  const [data, setData] = useState<WebHookListT>()
  const [, startTransition] = useTransition()
  const {
    openDialog: openUpdateDialog,
    onCloseDialog: onCloseUpdateDialog,
    onOpenDialog: onOpenUpdateDialog,
  } = useDialogShowState()

  const menus = [
    { label: 'Edit', onAction: onOpenUpdateDialog },
    { label: 'Disabled', onAction: () => console.log('test') },
    { label: 'Delete', onAction: () => console.log('test') },
  ]

  const fetchWebhooksById = async () => {
    startTransition(async () => {
      try {
        const res = await getWebHooksById(id)
        if (!res?.data) return
        setData(res.data as unknown as WebHookListT)
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchWebhooksById()
  }, [id])

  return (
    <>
      <WrapperDetail
        menus={menus}
        title={data?.url || 'N/A'}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
        >
          <ContentDetails
            label="Status"
            item={data?.status || 'N/A'}
          />
          <ContentDetails
            label="Description"
            item={data?.description || 'N/A'}
          />
          <ContentDetails
            label="Payload Format Version"
            item={data?.api_version || 'N/A'}
          />
        </Stack>
      </WrapperDetail>
      <DialogEditWebHook
        webhook={data as WebHookListT}
        openDialog={openUpdateDialog}
        onCloseDialog={onCloseUpdateDialog}
        fetchWebhooksById={fetchWebhooksById}
      />
    </>
  )
}

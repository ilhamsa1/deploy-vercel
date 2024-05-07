'use client'

import ContentDetails from '@/components/content-details'
import WrapperDetail from '@/components/wrapper-details'
import Stack from '@mui/material/Stack'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { User } from '@supabase/supabase-js'

import { useDialogShowState } from '@/hooks'
import { WebHookListT } from '@/models/web-hooks/types'

import { getWebHooksById } from './actions'
import DialogEditWebHook from './dialog/edit-endpoint'
import DialogDeleteWebHook from './dialog/delete-endpoint'

export default function WebhooksDetail({ id, user }: { id: string; user?: User }) {
  const [data, setData] = useState<WebHookListT>()
  const [, startTransition] = useTransition()
  const {
    openDialog: openUpdateDialog,
    onCloseDialog: onCloseUpdateDialog,
    onOpenDialog: onOpenUpdateDialog,
  } = useDialogShowState()

  const {
    openDialog: openDeleteDialog,
    onCloseDialog: onCloseDeleteDialog,
    onOpenDialog: onOpenDeleteDialog,
  } = useDialogShowState()

  const menus = [
    { label: 'Edit', onAction: onOpenUpdateDialog },
    { label: 'Disabled', onAction: () => console.log('test') },
    { label: 'Delete', onAction: onOpenDeleteDialog },
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
      <DialogDeleteWebHook
        webhook={data as WebHookListT}
        openDialog={openDeleteDialog}
        onCloseDialog={onCloseDeleteDialog}
        user={user}
      />
    </>
  )
}

'use client'

import ContentDetails from '@/components/content-details'
import WrapperDetail from '@/components/wrapper-details'
import Stack from '@mui/material/Stack'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

import { WebHookListT } from '@/models/web-hooks/types'

import { getWebHooksById } from './actions'

export default function WebhooksDetail({ id }: { id: string }) {
  const [data, setData] = useState<WebHookListT>()
  const [, startTransition] = useTransition()
  const menus = [
    { label: 'Edit', onAction: () => console.log('test') },
    { label: 'Disabled', onAction: () => console.log('test') },
    { label: 'Delete', onAction: () => console.log('test') },
  ]

  useEffect(() => {
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
    fetchWebhooksById()
  }, [id])

  return (
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
  )
}

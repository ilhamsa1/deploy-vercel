'use client'

import React, { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import { GridCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'

import Datagrid from '@/components/data-grid'
import { WebHookListT } from '@/models/web-hooks/types'

type Props = {
  webHooks: WebHookListT[]
  isLoading: boolean
  user?: User
}

const SectionListWebHooks: ComponentType<Props> = ({ webHooks, isLoading, user }) => {
  const router = useRouter()

  const columns = [
    {
      field: 'url',
      headerName: 'Url',
      flex: 1,
      minWidth: 240,
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'lowercase',
            }}
          >
            {data.row?.url || 'N/A'}
          </Typography>
        )
      },
    },
    {
      field: 'status',
      flex: 1,
      minWidth: 250,
      headerName: 'Status',
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.status || 'N/A'}</Typography>
      },
    },
  ]

  const handleRowClick = (data: GridCellParams) => {
    router.push(`/org/${user?.user_metadata.org.tag}/developers/webhook/${data.row.id}`)
  }

  return (
    <Datagrid
      noAction
      autoHeight
      rows={webHooks}
      columns={columns}
      loading={isLoading}
      hideFooter
      handleRowClick={handleRowClick}
    />
  )
}

export default SectionListWebHooks

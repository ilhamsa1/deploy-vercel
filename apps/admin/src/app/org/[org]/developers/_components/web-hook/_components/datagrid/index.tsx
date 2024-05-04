'use client'

import React, { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import { GridCellParams } from '@mui/x-data-grid'

import Datagrid from '@/components/data-grid'
import { WebHookListT } from '@/models/web-hooks/types'

type Props = {
  webHooks: WebHookListT[]
  isLoading: boolean
}

const SectionListWebHooks: ComponentType<Props> = ({ webHooks, isLoading }) => {
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
    console.log(data.row)
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

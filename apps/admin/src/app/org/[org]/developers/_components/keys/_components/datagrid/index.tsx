'use client'

import React, { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { GridActionsCellItem, GridCellParams } from '@mui/x-data-grid'

import Datagrid from '@/components/data-grid'
import { formatDateWithTime } from '@/lib/date'
import { Keys } from '../..'

type Props = {
  keys: Keys[]
  isLoading: boolean
  onOpenDeleteKeyDialog: (_row: Keys) => void
}

const ListKeys: ComponentType<Props> = ({ keys, isLoading, onOpenDeleteKeyDialog }) => {
  const columns = [
    {
      field: 'description',
      headerName: 'Access Key Name',
      flex: 1,
      minWidth: 240,
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.description || 'N/A'}</Typography>
      },
    },
    {
      field: 'created_at',
      flex: 1,
      minWidth: 250,
      headerName: 'Created',
      renderCell: (data: GridCellParams) => {
        return <Typography>{formatDateWithTime(data.row?.created_at)}</Typography>
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      renderCell: (data: GridCellParams) => {
        return (
          <GridActionsCellItem
            icon={<DeleteOutlineIcon />}
            label="Delete"
            onClick={() => onOpenDeleteKeyDialog(data.row)}
            color="inherit"
          />
        )
      },
    },
  ]

  return (
    <Datagrid
      noAction
      autoHeight
      rows={keys}
      columns={columns}
      loading={isLoading}
      hideFooter
    />
  )
}

export default ListKeys

'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { GridActionsCellItem, GridCellParams } from '@mui/x-data-grid'

import Datagrid from '@/components/data-grid'
import { formatDateWithTime } from '@/lib/date'

const ListKeys = ({ keys, isLoading }: any) => {
  const columns = [
    {
      field: 'description',
      headerName: 'Key Name',
      flex: 1,
      minWidth: 240,
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
      field: 'last_updated_at',
      flex: 1,
      minWidth: 250,
      headerName: 'Last Used',
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
            onClick={() => console.log(data.id)}
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

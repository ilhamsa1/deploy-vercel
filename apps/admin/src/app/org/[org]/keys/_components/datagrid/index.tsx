import Box from '@mui/material/Box'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GridActionsCellItem, GridCellParams, GridPaginationModel } from '@mui/x-data-grid'
import React, { useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

import Datagrid from '@/components/data-grid'

const ListKeys = () => {
  const [page] = useState(1)
  const [pageSize] = useState(20)
  const isLoading = false
  const count = 0

  const onOpenDialog = () => console.log('Open')

  const columns = [
    {
      field: 'name',
      headerName: 'Key Name',
      flex: 1,
      minWidth: 240,
    },
    {
      field: 'created_at',
      flex: 1,
      minWidth: 250,
      headerName: 'Created',
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
          <Box>
            <GridActionsCellItem
              icon={<CheckCircleIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => {
                onOpenDialog()
                console.log(data.id)
              }}
              color="inherit"
            />
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Delete"
              onClick={() => console.log(data.id)}
              color="inherit"
            />
          </Box>
        )
      },
    },
  ]

  const handlePaginationModelChange = (paginationModel: GridPaginationModel) => {
    console.log(paginationModel)
  }

  return (
    <Datagrid
      noAction
      rows={[]}
      loading={isLoading}
      columns={columns}
      page={page}
      pageSize={pageSize}
      rowCount={count}
      handlePaginationModelChange={handlePaginationModelChange}
    />
  )
}

export default ListKeys

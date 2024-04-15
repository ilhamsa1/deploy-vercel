import Typography from '@mui/material/Typography'
import { GridCellParams, GridPaginationModel, GridRowModel } from '@mui/x-data-grid'
import React, { useState } from 'react'

import Datagrid from '@/components/data-grid'
import { formatDateNameShortMonth } from '@/lib/date'

const List = ({ data, count, isLoading }: any) => {
  const [page] = useState(1)
  const [pageSize] = useState(20)

  console.log(data)

  const columns = [
    {
      field: 'display_name',
      flex: 1,
      minWidth: 150,
      headerName: 'Name',
      renderCell: (data: GridCellParams) => {
        console.log(data.row)
        return <Typography>{data.row?.user?.display_name || 'N/A'}</Typography>
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 150,
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'lowercase',
            }}
          >
            {data.row?.user?.email || '-'}
          </Typography>
        )
      },
    },
    {
      field: 'role',
      flex: 1,
      minWidth: 150,
      headerName: 'Role',
    },
    {
      field: 'created_at',
      flex: 1,
      minWidth: 150,
      headerName: 'Joined Date',
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'lowercase',
            }}
          >
            {formatDateNameShortMonth(data.row?.created_at)}
          </Typography>
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
      rows={data}
      loading={isLoading}
      columns={columns}
      page={page}
      pageSize={pageSize}
      rowCount={count}
      getRowId={(row: GridRowModel) => row.user_id}
      handlePaginationModelChange={handlePaginationModelChange}
    />
  )
}

export default List

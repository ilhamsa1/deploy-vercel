import Typography from '@mui/material/Typography'
import { GridCellParams, GridPaginationModel, GridRowModel } from '@mui/x-data-grid'
import React, { useState } from 'react'

import Datagrid from '@/components/data-grid'

const List = ({ users }: any) => {
  const [isLoading] = useState(false)
  const [page] = useState(1)
  const [pageSize] = useState(20)
  const [count] = useState(10)

  const columns = [
    {
      field: 'display_name',
      flex: 1,
      minWidth: 150,
      headerName: 'Name',
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.user?.display_name}</Typography>
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
            {data.row?.user?.email || 'N/A'}
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
      field: 'joinedDate',
      flex: 1,
      minWidth: 150,
      headerName: 'Joined Date',
    },
  ]

  const handlePaginationModelChange = (paginationModel: GridPaginationModel) => {
    console.log(paginationModel)
  }

  return (
    <Datagrid
      noAction
      rows={users?.data}
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

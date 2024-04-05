import Typography from '@mui/material/Typography'
import { GridCellParams, GridPaginationModel } from '@mui/x-data-grid'
import React, { useState } from 'react'

import Datagrid from '../../../../../data-grid'

const List: React.FC = () => {
  const [isLoading] = useState(false)
  const [page] = useState(1)
  const [pageSize] = useState(20)
  const [count] = useState(10)

  const columns = [
    {
      field: 'name',
      flex: 1,
      minWidth: 150,
      headerName: 'Name',
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
            {data.row?.email}
          </Typography>
        )
      },
    },
    {
      field: 'requestedDate',
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
      rows={[
        {
          id: 1,
          name: 'userA',
          email: 'user@example.com',
          requestedDate: '02-04-2024',
        },
      ]}
      loading={isLoading}
      columns={columns}
      page={page}
      pageSize={pageSize}
      rowCount={count}
      handlePaginationModelChange={handlePaginationModelChange}
    />
  )
}

export default List

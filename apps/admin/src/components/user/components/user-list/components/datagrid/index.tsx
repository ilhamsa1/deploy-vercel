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

  const handleRowClick = (item: any) => console.log(item)

  const handlePaginationModelChange = (paginationModel: GridPaginationModel) => {
    console.log(paginationModel)
  }

  return (
    <Datagrid
      rows={[]}
      loading={isLoading}
      columns={columns}
      handleRowClick={handleRowClick}
      page={page}
      pageSize={pageSize}
      rowCount={count}
      handlePaginationModelChange={handlePaginationModelChange}
    />
  )
}

export default List

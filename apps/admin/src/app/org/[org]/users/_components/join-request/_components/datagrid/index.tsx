import Typography from '@mui/material/Typography'
import { GridActionsCellItem, GridCellParams, GridPaginationModel } from '@mui/x-data-grid'
import React, { useState, ComponentType } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
// import CancelIcon from '@mui/icons-material/Cancel'
import Datagrid from '@/components/data-grid'
import { Box } from '@mui/material'

type Props = {
  onOpenDialog: () => void
}

const List: ComponentType<Props> = ({ onOpenDialog }) => {
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
            {/* <GridActionsCellItem
              icon={<CancelIcon />}
              label="Delete"
              onClick={() => console.log(data.id)}
              color="inherit"
            /> */}
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

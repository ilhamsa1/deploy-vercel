import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GridActionsCellItem, GridCellParams, GridPaginationModel } from '@mui/x-data-grid'
import React, { useState, ComponentType } from 'react'
// import CancelIcon from '@mui/icons-material/Cancel'

import Datagrid from '@/components/data-grid'
import { OrgJoinRequestT } from '@/models/organizations/types'

type Props = {
  data: OrgJoinRequestT[]
  count: number
  isLoading: boolean
  onOpenDialog: () => void
}

const List: ComponentType<Props> = ({ data, count, isLoading, onOpenDialog }) => {
  const [page] = useState(1)
  const [pageSize] = useState(20)

  const columns = [
    {
      field: 'user',
      headerName: 'User',
      flex: 1,
      minWidth: 240,
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.user?.display_name}</Typography>
      },
    },
    {
      field: 'note',
      flex: 1,
      minWidth: 250,
      headerName: 'Note',
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
      rows={data}
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

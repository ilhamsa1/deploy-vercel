import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { GridActionsCellItem, GridCellParams, GridPaginationModel } from '@mui/x-data-grid'
import React, { useState, ComponentType } from 'react'
// import CancelIcon from '@mui/icons-material/Cancel'

import Datagrid from '@/components/data-grid'
import { OrgInviteT } from '@/models/organizations/types'
import { formatDateNameShortMonth } from '@/lib/date'

type Props = {
  data: OrgInviteT[]
  count: number
  isLoading: boolean
  onOpenDialog: () => void
}

const List: ComponentType<Props> = ({ data = [], count, isLoading, onOpenDialog }) => {
  const [page] = useState(1)
  const [pageSize] = useState(20)

  const columns = [
    {
      field: 'send_to',
      flex: 1,
      minWidth: 150,
      headerName: 'Send To',
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'lowercase',
            }}
          >
            {data.row?.send_to}
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
      field: 'created_by',
      headerName: 'Created By',
      flex: 1,
      minWidth: 150,
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.user?.display_name}</Typography>
      },
    },
    {
      field: 'accepted_at',
      flex: 1,
      minWidth: 150,
      headerName: 'Accepted At',
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'lowercase',
            }}
          >
            {formatDateNameShortMonth(data.row?.accepted_at)}
          </Typography>
        )
      },
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

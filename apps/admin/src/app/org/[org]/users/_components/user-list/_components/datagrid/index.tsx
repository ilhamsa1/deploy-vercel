import Typography from '@mui/material/Typography'
import { GridCellParams, GridPaginationModel, GridRowModel } from '@mui/x-data-grid'
import React, { Dispatch, SetStateAction } from 'react'

import Datagrid from '@/components/data-grid'
import { formatDateNameShortMonth } from '@/lib/date'
import { PaginationParam } from '@/interfaces'

type Props = {
  users: GridRowModel[]
  count: number
  isLoading: boolean
  setPaginationModel: Dispatch<SetStateAction<PaginationParam>>
  paginationModel: PaginationParam
}

const List = ({ users, count, isLoading, setPaginationModel, paginationModel }: Props) => {
  const columns = [
    {
      field: 'display_name',
      flex: 1,
      minWidth: 150,
      headerName: 'Name',
      renderCell: (data: GridCellParams) => {
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

  const handlePaginationModelChange = (newPaginationModel: GridPaginationModel) => {
    setPaginationModel(newPaginationModel)
  }

  return (
    <Datagrid
      noAction
      rows={users}
      loading={isLoading}
      columns={columns}
      page={Number(paginationModel.page)}
      pageSize={Number(paginationModel.pageSize)}
      rowCount={count}
      getRowId={(row: GridRowModel) => row.user_id}
      handlePaginationModelChange={handlePaginationModelChange}
    />
  )
}

export default List

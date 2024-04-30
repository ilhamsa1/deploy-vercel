import Typography from '@mui/material/Typography'
import { GridCellParams, GridPaginationModel, GridRowModel, GridSortModel } from '@mui/x-data-grid'
import React, { Dispatch, SetStateAction } from 'react'

import DatagridCursorBased from '@/components/datagrid-cursor-based'

import { formatDateNameShortMonth } from '@/lib/date'

type Props = {
  users: GridRowModel[]
  totalRowCount: number
  isLoading: boolean
  setSortModel: Dispatch<SetStateAction<GridSortModel>>
  setOriginPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  getPageCursors: (_page: number, _isStrict: boolean) => (string | null)[]
  paginationModel: GridPaginationModel
  hasNextPage: boolean
}

const List = ({
  users,
  totalRowCount,
  isLoading,
  setSortModel,
  paginationModel,
  hasNextPage,
  setOriginPaginationModel,
  setPaginationModel,
  getPageCursors,
}: Props) => {
  const columns = [
    {
      field: 'display_name',
      flex: 1,
      minWidth: 150,
      sortable: false,
      headerName: 'Name',
      renderCell: (data: GridCellParams) => {
        return <Typography>{data.row?.user?.display_name || 'N/A'}</Typography>
      },
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      sortable: false,
      minWidth: 200,
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
      minWidth: 120,
      headerName: 'Role',
      renderCell: (data: GridCellParams) => {
        return (
          <Typography
            sx={{
              textTransform: 'uppercase',
            }}
          >
            {data.row?.role || '-'}
          </Typography>
        )
      },
    },
    {
      field: 'created_at',
      minWidth: 120,
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

  return (
    <DatagridCursorBased
      rows={users}
      autoHeight
      noAction
      columns={columns}
      loading={isLoading}
      getRowId={(row: GridRowModel) => row.user_id}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
      setOriginPaginationModel={setOriginPaginationModel}
      getPageCursors={getPageCursors}
      hasNextPage={hasNextPage}
      totalRowCount={totalRowCount}
      setSortModel={setSortModel}
    />
  )
}

export default List

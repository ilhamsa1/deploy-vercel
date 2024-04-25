import Typography from '@mui/material/Typography'
import {
  GridCellParams,
  GridPaginationModel,
  GridRowModel,
  GridPaginationMeta,
  DataGrid,
  GridSortModel,
} from '@mui/x-data-grid'
import React, { Dispatch, SetStateAction, useRef } from 'react'

import { formatDateNameShortMonth } from '@/lib/date'

type Props = {
  users: GridRowModel[]
  totalRowCount: number
  isLoading: boolean
  setSortModel: Dispatch<SetStateAction<GridSortModel>>
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  paginationModel: GridPaginationModel
  hasNextPage: string
}

const List = ({
  users,
  totalRowCount,
  isLoading,
  setSortModel,
  setPaginationModel,
  paginationModel,
  hasNextPage,
}: Props) => {
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

  const handleSortModelChange = React.useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setSortModel([...sortModel])
  }, [])

  const paginationMetaRef = useRef<GridPaginationMeta>()

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = React.useMemo(() => {
    if (hasNextPage !== undefined && paginationMetaRef.current?.hasNextPage !== !!hasNextPage) {
      paginationMetaRef.current = { hasNextPage: !!hasNextPage }
    }
    return paginationMetaRef.current
  }, [hasNextPage])

  return (
    <DataGrid
      rows={users}
      columns={columns}
      sortingMode="server"
      paginationMode="server"
      pageSizeOptions={[1, 10, 20, 50, 100]}
      initialState={{ pagination: { rowCount: -1 } }}
      onSortModelChange={handleSortModelChange}
      loading={isLoading}
      getRowId={(row: GridRowModel) => row.user_id}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      paginationMeta={paginationMeta}
      rowCount={totalRowCount}
    />
  )
}

export default List

import Typography from '@mui/material/Typography'
import {
  GridCellParams,
  GridPaginationModel,
  GridRowModel,
  GridPaginationMeta,
  DataGrid,
  GridSortModel,
} from '@mui/x-data-grid'
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Box from '@mui/material/Box'

import { formatDateNameShortMonth } from '@/lib/date'

type Props = {
  users: GridRowModel[]
  totalRowCount: number
  isLoading: boolean
  setSortModel: Dispatch<SetStateAction<GridSortModel>>
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  paginationModel: GridPaginationModel
  hasNextPage: boolean
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
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(totalRowCount || 0)
  const prevEstimatedRowCount = useRef<number | undefined>(undefined)
  const paginationMetaRef = useRef<GridPaginationMeta>()

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

  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    // Here you save the data you need from the sort model
    setSortModel([...sortModel])
  }, [])

  // Memoize to avoid flickering when the `hasNextPage` is `undefined` during refetch
  const paginationMeta = useMemo(() => {
    if (hasNextPage !== undefined && paginationMetaRef.current?.hasNextPage !== hasNextPage) {
      paginationMetaRef.current = { hasNextPage }
    }
    return paginationMetaRef.current
  }, [hasNextPage])

  useEffect(() => {
    if (paginationMeta?.hasNextPage) setRowCountState(-1)
  }, [paginationMeta?.hasNextPage])

  // Memoize to avoid flickering when the `totalRowCount` is `0` during refetch
  const estimatedRowCount = useMemo(() => {
    if (totalRowCount !== 0) {
      if (prevEstimatedRowCount.current === undefined) {
        prevEstimatedRowCount.current = totalRowCount
      }
      return totalRowCount
    }
    return prevEstimatedRowCount.current
  }, [totalRowCount])

  return (
    <Box sx={{ mt: '1rem' }}>
      <DataGrid
        rows={users}
        autoHeight
        columns={columns}
        sortingMode="server"
        paginationMode="server"
        pageSizeOptions={[10, 20, 50, 100]}
        onSortModelChange={handleSortModelChange}
        loading={isLoading}
        getRowId={(row: GridRowModel) => row.user_id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        paginationMeta={paginationMeta}
        rowCount={rowCountState}
        onRowCountChange={(newRowCount) => setRowCountState(newRowCount)}
        estimatedRowCount={estimatedRowCount}
      />
    </Box>
  )
}

export default List

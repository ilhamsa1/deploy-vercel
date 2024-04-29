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

  // This handler is called when the next page button is pressed
  const handlePaginationModelChange = useCallback(
    (newPaginationModel: GridPaginationModel) => {
      const currentPage = paginationModel.page
      const targetPage = newPaginationModel.page

      const [, nextCursor] = getPageCursors(targetPage - 1, true) || []
      const [prevCursor] = getPageCursors(targetPage + 1, true) || []

      if ((targetPage > currentPage && nextCursor) || prevCursor) {
        // If we have the next_cursor, we can allow the page to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else if ((targetPage < currentPage && prevCursor) || nextCursor) {
        // If we have the prev_cursor, we can allow the page to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else if (targetPage === currentPage) {
        // If page not changed, we allow only the pageSize to change.
        setOriginPaginationModel(paginationModel)
        setPaginationModel(newPaginationModel)
      } else {
        // Else, ignore the change.
        setPaginationModel({ ...paginationModel }) // trigger reload the same page
      }
    },
    [paginationModel, setPaginationModel, setOriginPaginationModel, getPageCursors],
  )

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

  useEffect(() => {
    if (totalRowCount) setRowCountState(totalRowCount)
  }, [totalRowCount])

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
        onPaginationModelChange={handlePaginationModelChange}
        paginationMeta={paginationMeta}
        rowCount={rowCountState}
        onRowCountChange={(newRowCount) => setRowCountState(newRowCount)}
        estimatedRowCount={estimatedRowCount}
      />
    </Box>
  )
}

export default List

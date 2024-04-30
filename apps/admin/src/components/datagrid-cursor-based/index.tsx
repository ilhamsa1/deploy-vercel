import {
  GridPaginationModel,
  GridRowModel,
  GridPaginationMeta,
  GridSortModel,
  GridColDef,
  GridRowId,
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

import DataGrid from '../data-grid'

type Props = {
  autoHeight?: boolean
  noAction?: boolean
  rows: GridRowModel[]
  totalRowCount: number
  loading?: boolean
  setSortModel: Dispatch<SetStateAction<GridSortModel>>
  setOriginPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>
  getPageCursors: (_page: number, _isStrict: boolean) => (string | null)[]
  paginationModel: GridPaginationModel
  hasNextPage: boolean
  columns: GridColDef[]
  getRowId: GridRowId | any
}

const DatagridCursorBased = ({
  rows,
  columns,
  totalRowCount,
  loading,
  setSortModel,
  paginationModel,
  hasNextPage,
  setOriginPaginationModel,
  setPaginationModel,
  getPageCursors,
  autoHeight,
  noAction,
  getRowId,
}: Props) => {
  // Some API clients return undefined while loading
  // Following lines are here to prevent `rowCountState` from being undefined during the loading
  const [rowCountState, setRowCountState] = useState(totalRowCount || 0)
  const prevEstimatedRowCount = useRef<number | undefined>(undefined)
  const paginationMetaRef = useRef<GridPaginationMeta>()

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
    <DataGrid
      noAction={noAction}
      rows={rows}
      autoHeight={autoHeight}
      columns={columns}
      onSortModelChange={handleSortModelChange}
      loading={loading}
      getRowId={getRowId}
      page={paginationModel.page}
      pageSize={paginationModel.pageSize}
      handlePaginationModelChange={handlePaginationModelChange}
      paginationMeta={paginationMeta}
      rowCount={rowCountState}
      onRowCountChange={(newRowCount) => setRowCountState(newRowCount)}
      estimatedRowCount={estimatedRowCount}
    />
  )
}

export default DatagridCursorBased

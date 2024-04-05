import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { GridActionsCellItem } from '@mui/x-data-grid/components'
import {
  GridActionsColDef,
  GridCellModes,
  GridCellModesModel,
  GridCellParams,
  GridColDef,
  GridPaginationModel,
  GridPreProcessEditCellProps,
  GridRowId,
  GridRowModel,
  GridRowParams,
  GridSortModel,
  GridValidRowModel,
} from '@mui/x-data-grid/models'

import { DataGridProps } from '@mui/x-data-grid/models/props/DataGridProps'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { computeMutation } from '../../lib/common'

import { styles, CustomizedDatagrid } from './styled'

export interface DatagridProps extends Omit<DataGridProps, 'onPaginationModelChange'> {
  rows: GridValidRowModel[]
  columns: GridColDef[]
  loading?: boolean

  getRowId?: GridRowId | any
  noAction?: boolean
  autoHeight?: boolean
  customActions?: (_params: GridRowParams) => React.ReactNode[]

  handleRowClick?: (_params: any) => void

  page: number
  pageSize: number
  rowCount: number
  handlePaginationModelChange?: (_item: GridPaginationModel) => void
  selectedRowIds?: string[]
  onSortModelChange?: (_item: GridSortModel) => void
  onRowSelected?: DataGridProps['onRowSelectionModelChange']
  onRowUpdate?: (_items: GridValidRowModel) => void
  hideFooterPagination?: boolean
  hideFooter?: boolean
}

export default function Datagrid({
  rows,
  columns,
  handleRowClick,
  rowCount,
  pageSize,
  page,
  handlePaginationModelChange,
  loading,
  onSortModelChange,
  noAction = false,
  onRowUpdate,
  autoHeight,
  customActions,
  onRowSelected,
  selectedRowIds,
  hideFooter,
  ...props
}: DatagridProps) {
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})
  const unsavedChangesRef = useRef<{
    unsavedRows: Record<GridRowId, GridValidRowModel>
    rowsBeforeChange: Record<GridRowId, GridValidRowModel>
  }>({
    unsavedRows: {},
    rowsBeforeChange: {},
  })

  const customColumns: GridColDef<GridValidRowModel | GridActionsColDef>[] = useMemo(() => {
    if (!rows || !rows.length) return []

    const overrideColums = columns.map((column) => {
      if (onRowUpdate && column.editable) {
        column.preProcessEditCellProps = (params: GridPreProcessEditCellProps) => {
          onRowUpdate({
            ...params.row,
            [column.field]: params.props.value,
          })
          return params
        }
      }
      return column
    })

    if (noAction) return overrideColums

    return [
      ...overrideColums,
      {
        field: 'grid-actions',
        type: 'actions',
        aggregable: false,
        filterable: false,
        groupable: false,
        hideable: false,
        pinnable: false,
        resizable: false,
        sortable: false,
        width: 40,
        getActions: (params: GridRowParams) => {
          return customActions && customActions(params).length > 0
            ? customActions(params)
            : [
                <GridActionsCellItem
                  key="actions"
                  onClick={() => {
                    if (!handleRowClick) return
                    handleRowClick(params)
                  }}
                  icon={<ArrowForwardIosIcon fontSize="small" />}
                  label="Select"
                />,
              ]
        },
      },
    ]
  }, [columns, customActions, handleRowClick, noAction, onRowUpdate, rows])

  // #region https://mui.com/x/react-data-grid/recipes-editing/#single-click-editing
  const isAnyColumnEditable = customColumns.some((col) => col.editable)

  const handleCellClick = useCallback((params: GridCellParams, event: React.MouseEvent) => {
    if (!params.isEditable) {
      return
    }

    // Ignore portal
    if (!event.currentTarget.contains(event.target as Element)) {
      return
    }

    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {},
            ),
          }),
          {},
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {},
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      }
    })
  }, [])

  const handleCellModesModelChange = useCallback((newModel: GridCellModesModel) => {
    setCellModesModel(newModel)
  }, [])

  // #endregion

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    if (onRowUpdate) {
      onRowUpdate(newRow)
    }

    const mutation = computeMutation(newRow, oldRow)

    if (mutation) {
      const rowId = newRow['id']

      unsavedChangesRef.current.unsavedRows[rowId] = newRow
      if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
        unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow
      }
    }

    return newRow
  }

  return (
    <CustomizedDatagrid
      disableRowSelectionOnClick
      autoHeight={autoHeight}
      rows={rows}
      columns={customColumns}
      onRowClick={handleRowClick}
      rowCount={rowCount}
      loading={loading}
      onSortModelChange={onSortModelChange}
      density="compact"
      pageSizeOptions={[10, 20, 50, 100]}
      paginationMode="server"
      sortingMode="server"
      onPaginationModelChange={handlePaginationModelChange}
      checkboxSelection={!!onRowSelected}
      rowSelection={!!onRowSelected}
      keepNonExistentRowsSelected={!!onRowSelected}
      rowSelectionModel={selectedRowIds}
      onRowSelectionModelChange={onRowSelected}
      hideFooter={hideFooter}
      paginationModel={{
        page,
        pageSize,
      }}
      getRowHeight={() => 'auto'}
      sx={[
        {
          py: 2,
          cursor: noAction && !isAnyColumnEditable ? 'default' : 'pointer',
        },
        styles.editableDatagrid,
      ]}
      // edit row props
      cellModesModel={isAnyColumnEditable ? cellModesModel : undefined}
      onCellModesModelChange={isAnyColumnEditable ? handleCellModesModelChange : undefined}
      onCellClick={isAnyColumnEditable ? handleCellClick : undefined}
      processRowUpdate={processRowUpdate}
      getRowClassName={({ id }) => {
        const unsavedRow = unsavedChangesRef.current.unsavedRows[id]
        if (unsavedRow) {
          return 'row--edited'
        }
        return ''
      }}
      getCellClassName={({ field, row }) => {
        if (row?.errors?.[field]?.length) {
          return 'cell--error'
        }
        return ''
      }}
      {...props}
    />
  )
}

import { alpha } from '@mui/material/styles'
import { SystemStyleObject } from '@mui/system'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'

import { colors, spacings, fontWeight } from '../../theme'

interface StylesProps {
  editCellContainer: SystemStyleObject
  editableDatagrid: SystemStyleObject
}

export const styles: StylesProps = {
  editCellContainer: {
    display: 'flex',
    alignItems: 'center',
    pr: spacings[100],
    width: '100%',
    '& > div': {
      width: '100%',
    },
  },
  editableDatagrid: {
    '& .MuiDataGrid-row.Mui-selected.row--edited, & .MuiDataGrid-row.row--edited': {
      backgroundColor: () => {
        return `${alpha(colors.secondary200, 0.2)} !important`
      },
    },
    '& .MuiDataGrid-row.Mui-selected': {
      backgroundColor: 'unset !important',
    },
    '& .MuiDataGrid-row .cell--error': {
      backgroundColor: `${alpha(colors.secondary200, 0.2)} !important`,
    },
    '& .MuiDataGrid-cell--editable': {
      border: `dashed 1px ${colors.neutral700}`,
      m: '1px',
      borderRadius: spacings[200],
      cursor: 'pointer',
    },
  },
}

export const Container = styled('div')({
  display: 'flex',
  height: '100%',
})

export const CustomizedDatagrid = styled(DataGrid)`
  margin-top: 1.25rem;
  padding-bottom: 0 !important;
  padding-top: 0 !important;
  font-size: 1rem !important;

  & .MuiDataGrid-root {
    border-style: none;
  }

  & .MuiDataGrid-columnHeader:focus,
  & .MuiDataGrid-columnHeader:focus-within {
    outline: none !important;
  }

  & .MuiDataGrid-cell:focus,
  & .MuiDataGrid-cell:focus-within {
    outline: none !important;
  }

  & .MuiDataGrid-withBorderColor {
    border-color: #e3e2e7;
  }

  & .MuiDataGrid-row {
    background-color: #ffffff;
  }

  & .MuiDataGrid-iconSeparator {
    display: none;
  }

  & .MuiDataGrid-cell {
    line-height: unset !important;
    max-height: none !important;
    white-space: normal;
    display: flex !important;
    align-items: center;
    font-weight: 400;
    font-size: 1rem;
    padding-top: 24px !important;
    padding-bottom: 24px !important;
    color: #212121;
    text-transform: capitalize;
  }

  & .MuiDataGrid-colCellTitle {
    font-weight: 600;
  }

  & .MuiPaginationItem-root {
    border-radius: 0;
  }

  & .Mui-selected {
    background-color: #e3e2e7 !important;
  }

  & .MuiDataGrid-columnHeaderTitle {
    overflow: hidden !important;
    font-weight: ${fontWeight.semiBold} !important;
    font-size: 1rem;
    line-height: 1.1rem;
    color: #212121;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: capitalize;
  }

  & .MuiDataGrid-sortIcon {
    color: ${colors.white};
  }

  & .MuiDataGrid-menuIcon {
    visibility: hidden !important;
  }

  & .MuiDataGrid-iconButtonContainer button {
    background-color: #b5b5b8;
    margin-left: 2px;
  }

  & .MuiDataGrid-footerContainer {
    background-color: #ffffff;
  }

  & .MuiTablePagination-root p {
    margin: 0 !important;
  }

  & .MuiTablePagination-displayedRows {
    font-size: 1rem;
  }
`

import { Components, Theme } from '@mui/material/styles'
import { palette } from '../colors'

export const MuiInputField = {
  styleOverrides: {
    root: {
      height: '100%',
      backgroundColor: palette.background.default,
    },
    notchedOutline: {
      borderColor: palette.common.neutral600,
      borderWidth: '1px',
    },
  },
} satisfies Components<Theme>['MuiOutlinedInput']

export const MuiTextField = {
  styleOverrides: {
    root: {
      height: '100%',
    },
  },
} satisfies Components<Theme>['MuiTextField']

export const MuiFilledInput = {
  styleOverrides: {
    root: {
      borderRadius: 0,
    },
    input: {
      padding: '13px 16px',
    },
  },
} satisfies Components<Theme>['MuiFilledInput']

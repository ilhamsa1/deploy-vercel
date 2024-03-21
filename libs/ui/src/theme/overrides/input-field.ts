import { Components, Theme } from '@mui/material/styles'
import { borderRadius } from '../border-radius'
import { palette } from '../colors'

export const MuiInputField = {
  styleOverrides: {
    root: {
      height: '100%',
      backgroundColor: palette.background.default,
      borderRadius: borderRadius[200],
    },
    notchedOutline: {
      borderColor: palette.common.neutral600,
      borderWidth: '1px',
      borderRadius: borderRadius[200],
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

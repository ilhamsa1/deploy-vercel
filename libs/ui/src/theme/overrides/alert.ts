import { Components, Theme } from '@mui/material/styles'

export const MuiAlert = {
  styleOverrides: {
    action: {
      padding: 0,
    },
  },
} satisfies Components<Theme>['MuiAlert']

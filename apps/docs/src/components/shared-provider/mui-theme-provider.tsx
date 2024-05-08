'use client'
import React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'

import muitheme from '../../theme/muitheme'

const MuiThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={muitheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>{children}</LocalizationProvider>
    </ThemeProvider>
  )
}

export default MuiThemeProvider

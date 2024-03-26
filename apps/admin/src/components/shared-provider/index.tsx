'use client'
import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

import '@fontsource-variable/open-sans'
import 'react-day-picker/dist/style.css'

import MuiThemeProvider from './mui-theme-provider'

const SharedProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MuiThemeProvider>{children}</MuiThemeProvider>

      <ProgressBar
        height="4px"
        color="#fffd00"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  )
}

export default SharedProvider

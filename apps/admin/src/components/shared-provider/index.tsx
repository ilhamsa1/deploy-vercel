'use client'
import React from 'react'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

import '@fontsource-variable/open-sans'
import 'react-day-picker/dist/style.css'

import ReactQueryProvider from './react-query-provider'
import MuiThemeProvider from './mui-theme-provider'

const SharedProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ReactQueryProvider>
        <MuiThemeProvider>{children}</MuiThemeProvider>
      </ReactQueryProvider>

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

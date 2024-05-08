import React from 'react'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'

import SharedProvider from '@/components/shared-provider'

export const metadata: Metadata = {
  title: 'Luxe Homepage',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="robots"
          content="noindex"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SharedProvider>
            {children}
            <Toaster />
          </SharedProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

'use client'

import React, { ComponentProps, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import { SharedProvider } from '@luxe/ui'
import { LIST_SIDEMENU } from '../../config/sidemenu'
import { Layout } from '../layout'
import { logout } from './actions'

type SideMenuItem = ComponentProps<typeof Layout>['sideMenuItems'][0]

const WrapperProvider = ({ children, user }: { children: React.ReactNode; user?: any }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState(false)

  const pathnameArray = pathname.split('/') // (1) "/transactions/uuid" => ['', 'transactions', 'uuid']
  const isBack = pathnameArray.length > 2

  const onClickBack = isBack ? router.back : undefined
  const onSignOut = async () => {
    await logout()
  }

  const isActive = (itemUrl: string) => {
    return (
      (pathname.length === 1 && itemUrl?.length === 1) ||
      (pathname.indexOf(itemUrl) >= 0 && itemUrl?.length !== 1)
    )
  }

  const sideMenuItems = LIST_SIDEMENU.map((menuItem) => {
    return {
      ...menuItem,
      active: isActive(menuItem.url),
    } satisfies SideMenuItem
  })

  return (
    <SharedProvider>
      <Layout
        title="Luxe Dashboard"
        onClickBack={onClickBack}
        onOpenDrawer={() => setOpenDrawer(true)}
        sideMenuItems={sideMenuItems}
        onSignOut={onSignOut}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      >
        {children}
      </Layout>

      <Toaster />

      {/* <NotificationBar /> */}
    </SharedProvider>
  )
}

export default WrapperProvider

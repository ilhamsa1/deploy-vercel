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
    // will update this logic after we have dynamic url page
    // split the path url first to get the name of the page
    const splitSlashPathname = pathname.split(/\//)
    const splitSlashItemUrl = itemUrl.split(/\//)
    // then try to get the last url name
    const lastPathname = splitSlashPathname.pop()
    const lastItemUrl = splitSlashItemUrl.pop()

    return lastPathname === lastItemUrl
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

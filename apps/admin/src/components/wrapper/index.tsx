'use client'

import React, { ComponentProps, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'
import SharedProvider from '../shared-provider'
import { LIST_SIDEMENU } from '../../config/sidemenu'
import Layout from '../layout'
import { logout } from './actions'

type SideMenuItem = ComponentProps<typeof Layout>['sideMenuItems'][0]

const WrapperProvider = ({
  children,
  user,
  prefixUrl,
}: {
  children: React.ReactNode
  user?: any
  prefixUrl?: string
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState(false)

  const pathnameArray = pathname.split('/') // (1) "/transactions/uuid" => ['', 'transactions', 'uuid']
  const isBack = pathnameArray.length > 2

  // TODO: store user into into redux store

  const onClickBack = isBack ? router.back : undefined
  const onSignOut = async () => {
    await logout()
  }

  const isActive = (itemUrl: string) => {
    // will update this logic after we have dynamic url page
    // split the path url first to get the name of the page
    const splitSlashPathname = pathname.split(/\//).filter((url) => {
      const isEmptyString = url === '' // is Url empty string
      const isUrlContainsNumbers = /\d/.test(url) // check is url contains numbers

      return !isEmptyString && !isUrlContainsNumbers
    })
    const splitSlashItemUrl = itemUrl.split(/\//).filter((url) => {
      const isEmptyString = url === '' // is Url empty string
      const isUrlContainsNumbers = /\d/.test(url) // check is url contains numbers

      return !isEmptyString && !isUrlContainsNumbers
    })

    // then try to get the last url name
    const lastPathname = splitSlashPathname.pop()
    const lastItemUrl = splitSlashItemUrl.pop()

    return lastPathname === lastItemUrl
  }

  const sideMenuItems = LIST_SIDEMENU.map((menuItem) => {
    const url = prefixUrl ? `${prefixUrl}${menuItem.url}` : menuItem.url

    return {
      ...menuItem,
      active: isActive(url),
      url,
    } satisfies SideMenuItem
  })

  return (
    <SharedProvider>
      <Layout
        user={user}
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

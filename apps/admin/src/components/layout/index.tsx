import { SideMenu } from '../sidemenu'
import { ComponentProps, ComponentType } from 'react'

import Header from '../header'
import {
  AppContainer,
  ContainerDetail,
  ContentContainer,
  PageContainer,
  RootContainer,
} from './styled'

type Props = ComponentProps<typeof SideMenu> &
  ComponentProps<typeof Header> &
  ComponentProps<'div'> & { user: any }

const Layout: ComponentType<Props> = ({
  user,
  children,
  title,
  onClickBack,
  onOpenDrawer,
  sideMenuItems,
  onSignOut,
  openDrawer,
  setOpenDrawer,
}) => {
  return (
    <RootContainer>
      <ContentContainer>
        {!!user && (
          <SideMenu
            sideMenuItems={sideMenuItems}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
          />
        )}
        <AppContainer>
          <PageContainer>
            <Header
              title={title}
              onClickBack={onClickBack}
              onOpenDrawer={onOpenDrawer}
              onSignOut={onSignOut}
            />
            <ContainerDetail>{children}</ContainerDetail>
          </PageContainer>
        </AppContainer>
      </ContentContainer>
    </RootContainer>
  )
}

export default Layout

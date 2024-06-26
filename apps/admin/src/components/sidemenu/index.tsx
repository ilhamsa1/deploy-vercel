import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { ComponentType } from 'react'

import { global } from '../../theme'
import DrawerMenuList, { DrawerProps } from './drawer-menu-list'

import Stack from '@mui/material/Stack'
import LogoutButton from '../button/logout-button'

interface Props extends DrawerProps {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window
  openDrawer: boolean
}

export const SideMenu: ComponentType<Props> = ({
  window,
  openDrawer,
  setOpenDrawer,
  sideMenuItems,
}) => {
  const container = window && window !== undefined ? () => window().document.body : undefined

  return (
    <Box
      component="nav"
      sx={styles.container}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        container={container}
        variant="temporary"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={styles.drawer}
      >
        <DrawerMenuList {...{ sideMenuItems, setOpenDrawer }} />
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={styles.drawer}
      >
        <DrawerMenuList {...{ sideMenuItems, setOpenDrawer }} />
        <Stack sx={{ m: 2 }}>
          <LogoutButton />
        </Stack>
      </Drawer>
    </Box>
  )
}

const styles = {
  container: {
    width: {
      md: global.drawerWidth,
    },
    flexShrink: {
      md: 0,
    },
  },
  drawer: {
    display: { xs: 'none', md: 'block' },
    '& .MuiDrawer-paper': {
      width: global.drawerWidth,
    },
  },
}

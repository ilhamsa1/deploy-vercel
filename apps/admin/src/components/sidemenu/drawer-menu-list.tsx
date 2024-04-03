import { ComponentType } from 'react'

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import Close from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import Chip from '../chip'
import Link from '../link'

import { colors, global } from '../../theme'

export type DrawerProps = {
  sideMenuItems: SideMenuItem[]
  setOpenDrawer: (_value: boolean) => void
}

export interface SideMenuItem {
  key: string
  label: string
  icon: string
  url: string
  info?: string
  active: boolean
}

const DrawerMenuList: ComponentType<DrawerProps> = ({ sideMenuItems, setOpenDrawer }) => {
  const theme = useTheme()
  return (
    <Box>
      <Box sx={styles.iconButtonWrapper}>
        <IconButton onClick={() => setOpenDrawer(false)}>
          <Close
            color="primary"
            sx={styles.closeIcon}
          />
        </IconButton>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={styles.titleWrapper}
      >
        <Typography variant="h4">Lexupay</Typography>
        <KeyboardArrowDownIcon />
      </Box>
      <Divider variant="middle" />
      <Box sx={styles.sideMenuWrapper}>
        {sideMenuItems.map((menuItem) => {
          const color = menuItem.active ? theme.palette.primary.main : 'inherit'
          return (
            <Link
              key={menuItem.key}
              href={menuItem.url}
              color="inherit"
            >
              <MenuItem sx={styles.menuItem}>
                {menuItem.icon && <Icon sx={{ color }}>{menuItem.icon}</Icon>}

                <Box sx={styles.menuItemLabelWrapper}>
                  <Typography sx={styles.menuItemLabel(menuItem.active)}>
                    {menuItem.label}
                  </Typography>
                  <Box sx={styles.box(menuItem.active)} />
                </Box>

                {menuItem.info && (
                  <Chip
                    label={menuItem.info}
                    color="primary"
                  />
                )}
              </MenuItem>
            </Link>
          )
        })}
      </Box>
    </Box>
  )
}

const styles = {
  iconButtonWrapper: {
    display: { xs: 'block', md: 'none' },
    position: 'absolute',
    top: '0.25rem',
    right: '0.25rem',
    zIndex: 10,
  },
  titleWrapper: {
    px: 3,
    py: 1,
    height: global.headerHeight,
    minHeight: global.headerHeight,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    px: '1rem',
    py: '1rem',
  },
  menuItemLabelWrapper: { position: 'relative' },
  menuItemLabel: (active: boolean) => ({
    flexGrow: 1,
    fontSize: '1rem',
    fontWeight: active ? '600' : '300',
  }),
  closeIcon: { fontSize: 24 },
  sideMenuWrapper: { mt: 2 },
  box: (active: boolean) => ({
    display: active ? 'block' : 'none',
    background: colors.primary500,
    width: '3rem',
    height: '0.2rem',
    margin: 'auto',
    position: 'absolute',
    bottom: '-0.3rem',
    left: 0,
    right: 0,
  }),
}

export default DrawerMenuList

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

import { global } from '../../theme'

export type DrawerProps = {
  sideMenuItems: SideMenuItem[]
  setOpenDrawer: (value: boolean) => void
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
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          top: '0.25rem',
          right: '0.25rem',
          zIndex: 10,
        }}
      >
        <IconButton onClick={() => setOpenDrawer(false)}>
          <Close
            color="primary"
            sx={{ fontSize: 24 }}
          />
        </IconButton>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 3,
          py: 1,
          height: global.headerHeight,
          minHeight: global.headerHeight,
        }}
      >
        <Typography
          variant="h4"
          color="#697077"
        >
          Lexupay
        </Typography>
        <KeyboardArrowDownIcon />
      </Box>
      <Divider variant="middle" />
      <Box sx={{ mt: 2 }}>
        {sideMenuItems.map((menuItem) => {
          const color = menuItem.active ? theme.palette.primary.main : 'inherit'
          return (
            <Link
              key={menuItem.key}
              href={menuItem.url}
              color="inherit"
            >
              <MenuItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  px: '1rem',
                  py: '1rem',
                }}
              >
                {menuItem.icon && <Icon sx={{ color }}>{menuItem.icon}</Icon>}

                <Box
                  sx={{
                    position: 'relative',
                  }}
                >
                  <Typography
                    sx={{
                      flexGrow: 1,
                      fontSize: '1rem',
                      fontWeight: menuItem.active ? '600' : '300',
                    }}
                  >
                    {menuItem.label}
                  </Typography>
                  <Box
                    sx={(theme) => ({
                      display: menuItem.active ? 'block' : 'none',
                      background: theme.palette.primary.main,
                      width: '3rem',
                      height: '0.2rem',
                      margin: 'auto',
                      position: 'absolute',
                      bottom: '-0.3rem',
                      left: 0,
                      right: 0,
                    })}
                  />
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

export default DrawerMenuList

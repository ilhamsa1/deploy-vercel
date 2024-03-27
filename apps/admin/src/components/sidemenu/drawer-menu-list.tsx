import { ComponentType } from 'react'
import Close from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

import Chip from '../chip'
import Link from '../link'

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
      <Box sx={{ mt: 6 }}>
        {sideMenuItems.map((menuItem) => {
          const color = menuItem.active ? theme.palette.primary.main : 'inherit'
          return (
            <Link
              key={menuItem.key}
              href={menuItem.url}
              color="inherit"
              withoutUnderline
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

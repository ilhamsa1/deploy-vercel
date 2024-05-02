import React, { SyntheticEvent, useState } from 'react'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'

import IconButtonBadge from '../icon-button-badge'
import { global, colors } from '../../theme'

import ProfileMenu from './profile-menu'

interface HeaderProps {
  title: string
  onOpenDrawer?: () => void
  onClickBack?: () => void
  notificationCount?: string | number
  onClickNotification?: (_event: SyntheticEvent<HTMLElement>) => void
  onSignOut: () => void
  prefixUrl: string
}

export default function Header({
  notificationCount,
  onClickNotification,
  onSignOut,
  prefixUrl,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      sx={styles.appBarContainer}
    >
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Toolbar
          variant="dense"
          sx={styles.toolbar}
        >
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
          >
            {onClickNotification && (
              <IconButtonBadge
                iconName="notifications"
                color="inherit"
                badgeContent={Number(notificationCount ?? 0)}
                badgeColor="primary"
                onClick={onClickNotification}
              />
            )}
            <Tooltip
              title="Account settings"
              enterDelay={1000}
            >
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                sx={{ color: 'black' }}
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <ProfileMenu
              anchorEl={anchorEl}
              handleClose={handleClose}
              onSignOut={onSignOut}
              prefixUrl={prefixUrl}
            />
          </Stack>
        </Toolbar>
      </Stack>
    </AppBar>
  )
}

const styles = {
  appBarContainer: {
    width: '100%',
    background: colors.primary50,
    backdropFilter: 'blur(6px)',
    borderBottom: `1px solid ${colors.primary50}`,
  },
  toolbar: {
    px: { xs: 1.5, md: 3 },
    py: 1,
    height: global.headerHeight,
    minHeight: global.headerHeight,
  },
}

import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { global, IconButtonBadge } from '@luxe/ui'
import { SyntheticEvent, useState } from 'react'

import { ProfileMenu } from './profile-menu'

interface HeaderProps {
  title: string
  onOpenDrawer?: () => void
  onClickBack?: () => void
  notificationCount?: string | number
  onClickNotification?: (event: SyntheticEvent<HTMLElement>) => void
  onSignOut: () => void
}

export function Header({
  title,
  onOpenDrawer,
  onClickBack,
  notificationCount,
  onClickNotification,
  onSignOut,
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
      sx={{
        width: '100%',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          px: { xs: 1.5, md: 3 },
          py: 1,
          height: global.headerHeight,
          minHeight: global.headerHeight,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <IconButton
            color="primary"
            onClick={onOpenDrawer}
            sx={{
              mr: { xs: 1 },
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          {onClickBack && (
            <IconButton
              sx={{ mr: { xs: 1.5, md: 3 } }}
              onClick={onClickBack}
            >
              <ArrowBackIosIcon />
            </IconButton>
          )}

          <Typography
            variant="h4"
            noWrap
            sx={{
              flexGrow: 1,
              textTransform: 'capitalize',
            }}
          >
            {title}
          </Typography>
        </Stack>

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
          />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import BusinessIcon from '@mui/icons-material/Business'

interface ProfileMenuProps {
  anchorEl: null | HTMLElement
  handleClose: () => void
  onSignOut: () => void
}

export default function ProfileMenu({ anchorEl, handleClose, onSignOut }: ProfileMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={Boolean(anchorEl)}
      onClose={handleClose}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      slotProps={{
        paper: {
          elevation: 1,
          sx: {
            overflow: 'visible',
            mt: 1.5,
            color: 'black',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        },
      }}
    >
      <MenuItem
        sx={{ p: '12px 20px', minWidth: '200px' }}
        onClick={handleClose}
      >
        <Stack gap={1}>
          {/* User Name */}
          <Typography variant="h6">John Doe</Typography>
          <Stack gap={0.125}>
            {/* User Email */}
            <Typography variant="caption">johndoe@mail.co</Typography>
            {/* User Tier/Role */}
            <Typography variant="caption">Admin</Typography>
          </Stack>
          {/* User Organization */}
          <Stack
            direction="row"
            alignItems="center"
            gap={0.5}
          >
            <BusinessIcon />
            <Typography variant="caption">Organization</Typography>
          </Stack>
        </Stack>
      </MenuItem>
      <MenuItem
        sx={{ p: '10px 20px' }}
        onClick={handleClose}
      >
        <Typography variant="button">API</Typography>
      </MenuItem>
      <MenuItem
        sx={{ p: '10px 20px' }}
        onClick={onSignOut}
      >
        <Typography
          variant="button"
          sx={{ textTransform: 'initial' }}
        >
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  )
}

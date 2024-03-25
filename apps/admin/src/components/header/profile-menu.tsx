import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import AccountBox from '@mui/icons-material/AccountBox'
import Logout from '@mui/icons-material/Logout'
import Settings from '@mui/icons-material/Settings'

interface ProfileMenuProps {
  anchorEl: null | HTMLElement
  handleClose: () => void
  onSignOut: () => void
}

export function ProfileMenu({ anchorEl, handleClose, onSignOut }: ProfileMenuProps) {
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
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <AccountBox fontSize="small" />
        </ListItemIcon>
        Profile
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleClose}>
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={onSignOut}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}

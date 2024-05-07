import MoreVert from '@mui/icons-material/MoreVert'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import React, { useState } from 'react'

import { colors, spacings } from '../../theme'
import IconButtonBadge from '../icon-button-badge'

const UploadBtn = styled(Button)({
  padding: 0,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
  },
})

const styles = {
  wrapperChildren: (noBackground: boolean) => ({
    backgroundColor: noBackground ? 'inheret' : colors.white,
    borderRadius: '4px',
    p: noBackground ? `${spacings['600']} 0` : spacings['600'],
  }),
}

interface IMenu {
  label: string
  onAction: () => void
}

type Props = {
  title: string
  menus?: IMenu[]
  children: React.ReactNode
  onClickBack?: () => void
  /**
   * @deprecated These props should not be used again and need to be cleaned up in the future.
   */
  noBackground?: boolean
}

const WrapperDetail = ({ children, title, menus, onClickBack, noBackground = false }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Stack
        direction="column"
        alignItems="center"
        sx={{
          py: spacings[400],
          px: spacings[200],
          width: '100%',
          maxWidth: '1200px',
          '& .MuiPaper-root': {
            my: { xs: 0 },
          },
        }}
      >
        <Stack
          direction="column"
          gap={{ xs: spacings['300'], md: spacings['400'] }}
          sx={{
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack
              direction="row"
              gap={1}
              alignItems="center"
            >
              {onClickBack && (
                <IconButtonBadge
                  iconName="arrow_back_ios"
                  color="inherit"
                  sx={{ mr: { xs: spacings['300'], md: spacings['600'] } }}
                  onClick={onClickBack}
                />
              )}
              <Typography variant="h5">{title}</Typography>
            </Stack>
            {!!menus?.length && (
              <UploadBtn
                variant="text"
                color="inherit"
                sx={{ color: 'black', textTransform: 'capitalize' }}
                onClick={handleClick}
                endIcon={<MoreVert />}
              >
                Option
              </UploadBtn>
            )}
          </Stack>
          <Stack
            sx={styles.wrapperChildren(noBackground)}
            width="100%"
            gap={{ sm: spacings['600'], xs: spacings['300'] }}
          >
            {children}
          </Stack>
        </Stack>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menus?.map((menu: { key?: string; label: string; onAction: () => void }) => (
          <MenuItem
            key={menu.key || menu.label}
            onClick={() => {
              handleClose()
              menu.onAction()
            }}
            sx={{ textTransform: 'capitalize' }}
          >
            {menu.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default WrapperDetail

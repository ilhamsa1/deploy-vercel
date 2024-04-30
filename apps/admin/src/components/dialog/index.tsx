import MUIDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import { Breakpoint, styled } from '@mui/material/styles'
import React, { ReactEventHandler } from 'react'

import { palette } from '../../theme'
import Button from '../button'
import IconButton from '../icon-button-badge'

export interface DialogProps extends MuiDialogProps {
  open: boolean
  size?: Breakpoint
  onClose?: () => void
  title?: string
  fullscreen?: boolean
  children?: React.ReactNode
  fullWidth?: boolean
  fullHeight?: boolean
  onAccept?: ReactEventHandler<HTMLButtonElement>
  acceptLabel?: string
  disableAccept?: boolean
  loadingButton?: boolean
  cancelButton?: boolean
  component?: any
  autoComplete?: string
  footer?: React.ReactNode
}

const styles = {
  iconButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
}

const BtnCancel = styled(Button)({
  border: `1px solid ${palette.primary.main}`,
  color: palette.primary.main,
})

export default function Dialog({
  open,
  size,
  onClose,
  title,
  fullscreen,
  children,
  fullWidth,
  onAccept,
  acceptLabel,
  disableAccept,
  loadingButton,
  cancelButton,
  footer,
  fullHeight,
  ...props
}: DialogProps) {
  const hasActions = footer || cancelButton || onAccept

  return (
    <MUIDialog
      open={open}
      maxWidth={size}
      fullWidth={fullWidth}
      fullScreen={fullscreen}
      component="form"
      {...(fullHeight && {
        PaperProps: {
          sx: {
            height: '100%',
          },
        },
      })}
      {...props}
    >
      {title && onClose && (
        <>
          <DialogTitle>
            {title}
            {onClose && (
              <IconButton
                onClick={onClose}
                sx={styles.iconButton}
                iconName="close"
              />
            )}
          </DialogTitle>
          <Divider />
        </>
      )}
      <DialogContent>{children}</DialogContent>

      {hasActions && (
        <DialogActions>
          {footer}
          {cancelButton && (
            <BtnCancel
              variant="outlined"
              onClick={onClose}
            >
              cancel
            </BtnCancel>
          )}
          {onAccept && (
            <Button
              variant="contained"
              color="primary"
              disabled={disableAccept}
              isLoading={loadingButton}
              onClick={(event) => {
                event.preventDefault()
                onAccept(event)
              }}
              type="submit"
            >
              {acceptLabel}
            </Button>
          )}
        </DialogActions>
      )}
    </MUIDialog>
  )
}

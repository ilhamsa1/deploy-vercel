import MUIButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { ComponentType } from 'react'

import { FONTS } from '../../theme'

interface IButton extends MuiButtonProps {
  isLoading?: boolean
}

const muiBtnSizeToPropsMappings = {
  large: {
    size: 'large',
    sx: {
      ...FONTS.btnLarge,
      paddingY: '8px',
      paddingX: '22px',
      borderRadius: '8px',
    },
  },
  medium: {
    size: 'medium',
    sx: {
      ...FONTS.btnNormal,
      paddingY: '16px',
      paddingX: '12px',
      borderRadius: '2px',
    },
  },
  small: {
    size: 'small',
    sx: {
      ...FONTS.btnMedium,
      paddingY: '4px',
      paddingX: '10px',
      borderRadius: '6px',
    },
  },
} as Record<NonNullable<IButton['size']>, Partial<MuiButtonProps>>

const Button: ComponentType<IButton> = ({
  children,
  isLoading,
  disabled,
  size,
  variant,
  ...props
}) => {
  const mappedProps = muiBtnSizeToPropsMappings[size ?? 'medium']

  return (
    <MUIButton
      {...props}
      sx={{
        ...mappedProps.sx,
        textTransform: 'capitalize',
      }}
      variant={variant ?? 'contained'}
      disabled={disabled || isLoading}
      size={mappedProps.size}
    >
      {!isLoading ? (
        children
      ) : (
        <>
          <CircularProgress size="16px" />

          {/*
            Icon padding so that there's no layout shift when button is in loading state.
            Without this, somehow the icon does not have padding vertical,
            so the button's height is changed suddenly causing a layout shift.

            TL;DR: the following HTML is used to keep the button's height consistent in loading state.
           */}
          <span style={{ width: 0 }}>&nbsp;</span>
        </>
      )}
    </MUIButton>
  )
}

export default Button

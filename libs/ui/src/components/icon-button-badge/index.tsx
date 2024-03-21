import Icon from '@mui/material/Icon'
import MUIIconButton, { IconButtonProps } from '@mui/material/IconButton'
import { ComponentProps, ComponentType } from 'react'
import { Badge } from '../badge'

type IconColor =
  | 'inherit'
  | 'action'
  | 'disabled'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'

type FontSize = 'inherit' | 'large' | 'medium' | 'small'

type BadgeProps = ComponentProps<typeof Badge>

type Props = IconButtonProps & {
  iconName: string
  iconColor?: IconColor
  fontSize?: FontSize
  badgeContent?: BadgeProps['badgeContent']
  badgeColor?: BadgeProps['color']
  badgeVariant?: BadgeProps['variant']
}

export const IconButtonBadge: ComponentType<Props> = ({
  iconName,
  iconColor,
  fontSize,
  badgeContent,
  badgeColor,
  badgeVariant,
  ...props
}) => {
  return (
    <MUIIconButton {...props}>
      <Badge
        badgeContent={badgeContent}
        color={badgeColor}
        variant={badgeVariant}
      >
        <Icon color={iconColor} fontSize={fontSize}>
          {iconName}
        </Icon>
      </Badge>
    </MUIIconButton>
  )
}

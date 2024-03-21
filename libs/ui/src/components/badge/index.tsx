import MUIBadge from '@mui/material/Badge'
import { ComponentProps, ComponentType } from 'react'

type Props = ComponentProps<typeof MUIBadge>

export const Badge: ComponentType<Props> = ({ ...props }) => {
  return <MUIBadge {...props} />
}

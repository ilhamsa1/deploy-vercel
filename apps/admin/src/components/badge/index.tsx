import MUIBadge from '@mui/material/Badge'
import { ComponentProps, ComponentType } from 'react'

type Props = ComponentProps<typeof MUIBadge>

const Badge: ComponentType<Props> = ({ ...props }) => {
  return <MUIBadge {...props} />
}

export default Badge

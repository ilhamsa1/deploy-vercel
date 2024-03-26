import MUIChip from '@mui/material/Chip'
import { ComponentProps, ComponentType } from 'react'

type Props = ComponentProps<typeof MUIChip>

const Chip: ComponentType<Props> = ({ sx, ...props }) => {
  return (
    <MUIChip
      {...props}
      sx={{
        textTransform: 'capitalize',
        ...sx,
      }}
    />
  )
}

export default Chip

import InputLabel from '@mui/material/InputLabel'
import { Theme, styled } from '@mui/material/styles'

import { FONTS, palette } from '../../theme'

const Label = styled(InputLabel)(({ theme }: { theme: Theme }) => ({
  ...FONTS.fieldTitle,
  color: palette.common.neutral800,
  marginBottom: theme.spacing(0.5),
  textTransform: 'capitalize',
}))

export default Label

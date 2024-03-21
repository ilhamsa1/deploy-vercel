'use client'
import { Theme, createTheme } from '@mui/material/styles'

import { breakpoints } from './breakpoints'
import { colors, palette } from './colors'
import { overrides } from './overrides'
import { typography } from './typography'

const theme = {
  colors,
  palette,
  typography,
  breakpoints,
  components: overrides,
}

const muiTheme: Theme = createTheme(theme)

export default muiTheme

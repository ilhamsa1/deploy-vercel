import createBreakpoints from '@mui/system/createTheme/createBreakpoints'
import { global } from './global'

export const breakpoints = createBreakpoints({
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: global.maxContentWidth,
    xl: 1920,
  },
})

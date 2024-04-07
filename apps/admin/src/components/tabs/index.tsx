import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import MuiTabs from '@mui/material/Tabs'
import { styled } from '@mui/material/styles'
import { ComponentProps, Dispatch, SetStateAction, SyntheticEvent } from 'react'

import { palette } from '../../theme'

const CustomizedTab = styled(Tab)({
  textTransform: 'capitalize',

  '&.Mui-selected': {
    color: `${palette.text.primary} !important`,
  },
})

export interface TabProps extends ComponentProps<typeof Box> {
  value: number
  labels: string[]
  handleChange: Dispatch<SetStateAction<number>>
}

function tabId(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  }
}

const Tabs = ({ value, labels, handleChange, ...props }: TabProps) => {
  return (
    <Box
      {...props}
      width="100%"
      sx={{ ...props.sx, borderBottom: 1, borderColor: 'divider' }}
    >
      <MuiTabs
        value={value}
        textColor="primary"
        indicatorColor="primary"
        onChange={(event: SyntheticEvent<Element, Event>, value: number) => handleChange(value)}
      >
        {labels.map((label) => (
          <CustomizedTab
            key={label}
            label={label}
            {...tabId}
          />
        ))}
      </MuiTabs>
    </Box>
  )
}

export default Tabs

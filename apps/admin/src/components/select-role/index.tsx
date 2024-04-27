import Stack from '@mui/material/Stack'
import { ComponentType } from 'react'
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import Typography from '@/components/typography'

import { palette } from '@/theme'

type Props = {
  value: string
  onChange: (_value: string) => void
}

type Roles = {
  label: string
  value: string
  sublabel: string
}

const SelectRole: ComponentType<Props> = ({ value = 'admin', onChange }) => {
  const roles = [
    {
      label: 'Admin',
      value: 'admin',
      sublabel: 'Access all function in admin portal',
    },
    {
      label: 'Client',
      value: 'client',
      sublabel: 'Access to client portal only',
    },
  ]

  return (
    <Stack
      direction="column"
      spacing={1}
    >
      {roles.map(({ label, value: role, sublabel }: Roles) => {
        const isSelected = value === role
        return (
          <Stack
            key={role}
            direction="row"
            spacing={1}
            sx={styles.select(isSelected)}
            onClick={() => onChange(role)}
          >
            {isSelected ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
            <Stack direction="column">
              <Typography variant="body1">{label}</Typography>
              <Typography
                color={palette.common.neutral600}
                variant="caption"
              >
                {sublabel}
              </Typography>
            </Stack>
          </Stack>
        )
      })}
    </Stack>
  )
}

const styles = {
  select: (isSelected: boolean) => ({
    border: '3px solid',
    borderRadius: '4px',
    padding: '0.8rem',
    cursor: 'pointer',
    borderColor: isSelected ? 'green' : 'black',
  }),
}

export default SelectRole

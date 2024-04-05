import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { InputProps } from '@mui/material/Input'
import Stack from '@mui/material/Stack'
import MUITextField, { BaseTextFieldProps } from '@mui/material/TextField'
import React from 'react'

import Label from '../label'

interface ITextField extends BaseTextFieldProps {
  inputLabel?: string
  required?: boolean
  errorMessage?: string
  onChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void
  InputProps?: Partial<InputProps>
  fullHeight?: boolean
}

export default function FormTextField({
  inputLabel,
  required,
  errorMessage,
  fullHeight,
  ...props
}: ITextField) {
  return (
    <Stack
      width="100%"
      height={fullHeight ? '100%' : undefined}
    >
      {inputLabel && (
        <Label
          required={required}
          sx={{ height: '100%' }}
        >
          {inputLabel}
        </Label>
      )}
      <FormControl
        fullWidth
        sx={{ height: '100%' }}
      >
        <MUITextField
          variant="filled"
          size="small"
          {...props}
        />
        {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
      </FormControl>
    </Stack>
  )
}

import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { Cached } from '@mui/icons-material'
import React, { ChangeEvent, ComponentType } from 'react'

import Button from '@/components/button'

type Props = {
  onOpenDialog: () => void
  onReload: () => void
  searchDisplayName: string
  handleChange: (_e: ChangeEvent<HTMLInputElement>) => void
}

const Filter: ComponentType<Props> = ({
  onOpenDialog,
  onReload,
  searchDisplayName,
  handleChange,
}) => {
  return (
    <Grid
      container
      spacing={2}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{
        pt: '1.25rem',
        pr: '1.25rem',
        pl: '1.25rem',
      }}
    >
      <Grid
        item
        xs
        sm={3}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          name="user.display_name"
          defaultValue={searchDisplayName}
          onChange={handleChange}
        />
      </Grid>
      <Grid
        item
        xs
        sm={2}
      >
        <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={onOpenDialog}
        >
          Add User
        </Button>
      </Grid>
      <Grid item>
        <IconButton
          size="small"
          onClick={onReload}
        >
          <Cached />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default Filter

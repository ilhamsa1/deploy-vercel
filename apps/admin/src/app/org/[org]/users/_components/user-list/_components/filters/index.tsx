import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import React, { useState, ComponentType } from 'react'

import Button from '@/components/button'

type Props = {
  onOpenDialog: () => void
}

const Filter: ComponentType<Props> = ({ onOpenDialog }) => {
  const [search, setSearch] = useState<string>('')

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
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
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
    </Grid>
  )
}

export default Filter

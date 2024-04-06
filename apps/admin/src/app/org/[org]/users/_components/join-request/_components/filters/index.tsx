import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

const Filter: React.FC = () => {
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
    </Grid>
  )
}

export default Filter

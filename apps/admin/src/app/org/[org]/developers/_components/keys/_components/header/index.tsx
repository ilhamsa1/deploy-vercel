'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Button from '@/components/button'

const SectionHeader = ({ onOpenDialogCreateApi }: { onOpenDialogCreateApi: () => void }) => {
  return (
    <Grid
      container
      spacing={2}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
      sx={{
        pt: '1.25rem',
      }}
    >
      <Grid
        item
        xs
        sm={9}
      >
        <Box>
          <Typography variant="h5">Access Keys</Typography>
          <Typography>
            Access keys are used to authenticate API request coming from your servers
          </Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs
        sm={3}
      >
        <Button
          fullWidth
          size="small"
          variant="contained"
          onClick={onOpenDialogCreateApi}
        >
          Generate Access Key
        </Button>
      </Grid>
    </Grid>
  )
}

export default SectionHeader

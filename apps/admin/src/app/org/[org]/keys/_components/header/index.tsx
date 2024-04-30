import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

import Button from '@/components/button'

const SectionHeader = () => {
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
        sm={9}
      >
        <Box>
          <Typography variant="h5">Secret Keys</Typography>
          <Typography>
            Secret keys are used to authenticate API request coming from your servers
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
        >
          Generate Secret Key
        </Button>
      </Grid>
    </Grid>
  )
}

export default SectionHeader

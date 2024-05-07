import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Button from '@/components/button'

const EmptyKeys = ({ onOpenDialogCreateApi }: { onOpenDialogCreateApi: () => void }) => {
  return (
    <Stack
      sx={{ mt: '24px' }}
      alignItems="center"
      spacing={2}
    >
      <Stack alignItems="center">
        <Typography variant="h4">Access Keys haven't been set up yet.</Typography>
        <Typography variant="h4">Please set them up first.</Typography>
      </Stack>
      <Button
        onClick={onOpenDialogCreateApi}
        variant="contained"
        size="small"
      >
        Generate Access Key
      </Button>
    </Stack>
  )
}

export default EmptyKeys

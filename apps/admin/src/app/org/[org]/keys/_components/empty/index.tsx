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
        <Typography variant="h4">You have not set up your API Keys.</Typography>
        <Typography variant="h4">Please set it up first.</Typography>
      </Stack>
      <Button
        onClick={onOpenDialogCreateApi}
        variant="contained"
      >
        Generate Secret Key
      </Button>
    </Stack>
  )
}

export default EmptyKeys

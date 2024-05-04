import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import Button from '@/components/button'

const EmptyWebHook = ({ onOpenAddWebHookDialog }: { onOpenAddWebHookDialog: () => void }) => {
  return (
    <Stack
      sx={{ mt: '24px' }}
      alignItems="center"
      spacing={2}
    >
      <Stack alignItems="center">
        <Typography variant="h4">Webhooks haven't been set up yet.</Typography>
        <Typography variant="h4">Please set them up first.</Typography>
      </Stack>
      <Button
        onClick={onOpenAddWebHookDialog}
        variant="contained"
        size="small"
      >
        Add Endpoint
      </Button>
    </Stack>
  )
}

export default EmptyWebHook

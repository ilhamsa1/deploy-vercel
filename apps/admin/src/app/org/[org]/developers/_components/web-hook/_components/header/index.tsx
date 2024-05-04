'use client'

import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

import Button from '@/components/button'

const SectionHeader = ({ onOpenWebHookDialog }: { onOpenWebHookDialog: () => void }) => {
  return (
    <Stack
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        pt: '1.25rem',
      }}
    >
      <Typography variant="h5">Hosted endpoints</Typography>
      <Button
        size="small"
        variant="contained"
        onClick={onOpenWebHookDialog}
      >
        Add Endpoint
      </Button>
    </Stack>
  )
}

export default SectionHeader

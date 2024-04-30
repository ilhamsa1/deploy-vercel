import { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'

import { Stack } from '@mui/material'
import Button from '@/components/button'
import ContentDetails from '@/components/content-details'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogConfirmWithPassword: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  return (
    <Dialog
      cancelButton
      open={openDialog}
      onClose={onCloseDialog}
      fullWidth
    >
      <Stack spacing={4}>
        <Stack alignItems="center">
          <Typography variant="h4">Success</Typography>
          <Typography variant="body1">Secret API Key Success Created</Typography>
        </Stack>
        <Stack spacing={2}>
          <ContentDetails
            isRow
            label="API Key Description"
            item="IOS Device"
          />
          <Stack
            direction="row"
            alignContent="flex-start"
          >
            <TextField
              variant="filled"
              fullWidth
            />
            <Button
              variant="contained"
              startIcon={<ContentCopyIcon />}
              style={{ height: '52px' }}
            >
              Copy
            </Button>
          </Stack>
          <Stack
            direction="row"
            alignContent="flex-start"
          >
            <Typography variant="caption">
              This is the only time API key can be viewed or downloaded. Save this somewhere safe to
              prevent unauthorized use.
            </Typography>
            <Button
              variant="contained"
              style={{ height: '52px', maxWidth: '134px', width: '100%' }}
            >
              Download
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default DialogConfirmWithPassword

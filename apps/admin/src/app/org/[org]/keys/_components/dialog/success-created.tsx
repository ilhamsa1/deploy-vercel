import { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Stack from '@mui/material/Stack'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'

import Button from '@/components/button'
import ContentDetails from '@/components/content-details'
import { userCopyClipboard } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  description: string
  accessKey: string
}

const DialogConfirmWithPassword: ComponentType<Props> = ({
  openDialog,
  onCloseDialog,
  description,
  accessKey,
}) => {
  const onCopyToClipboard = userCopyClipboard(accessKey)
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
            item={description}
          />
          <Stack
            direction="row"
            alignContent="flex-start"
          >
            <TextField
              variant="outlined"
              fullWidth
              defaultValue={accessKey}
              disabled
            />
            <Button
              variant="contained"
              onClick={onCopyToClipboard}
              startIcon={<ContentCopyIcon />}
              style={{ height: '52px', width: '121px' }}
            >
              Copy
            </Button>
          </Stack>
          <Typography variant="caption">
            This is the only time API key can be viewed or downloaded. Save this somewhere safe to
            prevent unauthorized use.
          </Typography>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default DialogConfirmWithPassword

import { ComponentType } from 'react'
import Typography from '@mui/material/Typography'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import toast from 'react-hot-toast'
import Stack from '@mui/material/Stack'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'

import Button from '@/components/button'
import ContentDetails from '@/components/content-details'

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
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accessKey)
      toast.success('Copied to access key')
    } catch (error) {
      toast.error('Unable to copy to access key')
    }
  }

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
              onClick={copyToClipboard}
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

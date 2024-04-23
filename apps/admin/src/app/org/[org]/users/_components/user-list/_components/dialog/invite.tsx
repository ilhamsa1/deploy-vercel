import Stack from '@mui/material/Stack'
import { ComponentType, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import DialogSentInviteUser from './sent'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import Typography from '@/components/typography'
import Textfield from '@/components/textfield'

import { useDialogShowState } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
  inviteCode: string
}

const DialogInviteUser: ComponentType<Props> = ({ openDialog, onCloseDialog, inviteCode }) => {
  const {
    openDialog: openDialogSentInvite,
    onCloseDialog: onCloseDialogSentInvite,
    onOpenDialog: onOpenDialogSentInvite,
  } = useDialogShowState()
  const [email, setEmail] = useState('')

  const onSubmit = () => {
    onOpenDialogSentInvite()
    onCloseDialog()
  }

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      console.log('Copied to clipboard:', content)
    } catch (error) {
      console.error('Unable to copy to clipboard:', error)
    }
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Add User"
        fullWidth
      >
        <Stack
          direction="column"
          alignItems="center"
          spacing={2}
        >
          <Stack
            direction="column"
            alignItems="center"
            spacing={1}
          >
            <Typography variant="caption">Invitation Code</Typography>
            <Typography variant="h2">{inviteCode}</Typography>
            <Typography
              onClick={() => copyToClipboard('A1b2C34')}
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              variant="caption"
            >
              Copy code
            </Typography>
          </Stack>
          <Typography variant="body1">or share invitation code via email</Typography>
          <Stack
            direction="row"
            spacing={1}
            width="100%"
          >
            <Textfield
              value={email}
              placeholder="Enter email address"
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <Button
              onClick={onSubmit}
              color="primary"
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon />}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Dialog>
      <DialogSentInviteUser
        openDialog={openDialogSentInvite}
        onCloseDialog={onCloseDialogSentInvite}
      />
    </>
  )
}

export default DialogInviteUser

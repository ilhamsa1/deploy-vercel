import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ComponentType } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import DialogSentInviteUser from './sent'

import Dialog from '@/components/dialog'
import Button from '@/components/button'

import { useDialogShowState } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogInviteUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogSentInvite,
    onCloseDialog: onCloseDialogSentInvite,
    onOpenDialog: onOpenDialogSentInvite,
  } = useDialogShowState()

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Add Orgazation User"
        fullWidth
        footer={
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              onClick={onOpenDialogSentInvite}
              color="primary"
              variant="contained"
              size="small"
              endIcon={<ArrowForwardIcon />}
            >
              Continue
            </Button>
          </Stack>
        }
      >
        <Stack
          direction="column"
          spacing={2}
        >
          <Typography variant="body1">test</Typography>
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

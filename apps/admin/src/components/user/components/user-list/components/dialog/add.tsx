import Stack from '@mui/material/Stack'
import { ComponentType } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import ContentDetails from '@/components/content-details'
import Typography from '@/components/typography'

import DialogInviteUser from './invite'

import { useDialogShowState } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogAddUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogInvite,
    onCloseDialog: onCloseDialogInvite,
    onOpenDialog: onOpenDialogInvite,
  } = useDialogShowState()

  const onSubmit = () => {
    onOpenDialogInvite()
    onCloseDialog()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Add User"
        fullWidth
        footer={
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
          >
            <Button
              onClick={onSubmit}
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
          <Stack
            direction="column"
            spacing={1}
          >
            <ContentDetails
              isRow
              label="Fullname"
              item="Test"
            />
            <ContentDetails
              isRow
              label="Email"
              item="test@gmail.com"
            />
          </Stack>
          <Typography>Please select role that you want to assign to this user</Typography>
        </Stack>
      </Dialog>
      <DialogInviteUser
        openDialog={openDialogInvite}
        onCloseDialog={onCloseDialogInvite}
      />
    </>
  )
}

export default DialogAddUser

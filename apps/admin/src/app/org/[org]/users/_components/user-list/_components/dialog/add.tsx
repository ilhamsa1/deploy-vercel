import Stack from '@mui/material/Stack'
import { ComponentType, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import Typography from '@/components/typography'
import SelectRole from '@/components/select-role'

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
  const [selectRole, setSelectRole] = useState('admin')

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
          <Typography>Please select role that you want to assign to this user</Typography>
          <SelectRole
            selectRole={selectRole}
            setSelectRole={setSelectRole}
          />
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

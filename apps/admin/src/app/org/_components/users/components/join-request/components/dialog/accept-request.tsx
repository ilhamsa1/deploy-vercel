import Stack from '@mui/material/Stack'
import { ComponentType, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import Dialog from '@/components/dialog'
import Button from '@/components/button'
import ContentDetails from '@/components/content-details'
import Typography from '@/components/typography'
import SelectRole from '@/components/select-role'

import DialogAddedRequestUser from './added-request'

import { useDialogShowState } from '@/hooks'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const DialogAcceptRequestUser: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const {
    openDialog: openDialogAdded,
    onCloseDialog: onCloseDialogAdded,
    onOpenDialog: onOpenDialogAdded,
  } = useDialogShowState()
  const [selectRole, setSelectRole] = useState('admin')

  const onSubmit = () => {
    onOpenDialogAdded()
    onCloseDialog()
  }

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        title="Accept Request"
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
          <SelectRole
            selectRole={selectRole}
            setSelectRole={setSelectRole}
          />
        </Stack>
      </Dialog>
      <DialogAddedRequestUser
        openDialog={openDialogAdded}
        onCloseDialog={onCloseDialogAdded}
      />
    </>
  )
}

export default DialogAcceptRequestUser

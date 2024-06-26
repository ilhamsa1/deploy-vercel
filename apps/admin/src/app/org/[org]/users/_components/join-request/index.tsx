'use client'

import Box from '@mui/material/Box'
import { useEffect, useState, useTransition } from 'react'
import toast from 'react-hot-toast'

import { useDialogShowState } from '@/hooks'
import { OrgJoinRequestT } from '@/models/organizations/types'
import Datagrid from './_components/datagrid'
import DialogAcceptRequestUser from './_components/dialog/accept-request'
import Filters from './_components/filters'

import { getOrgJoinRequests } from './actions'

const OrgJoinRequestList = () => {
  const { openDialog, onCloseDialog, onOpenDialog } = useDialogShowState()
  const [data, setData] = useState<OrgJoinRequestT[]>([])
  const [count, setCount] = useState<number>(0)
  const [isLoading, startTransition] = useTransition()

  const fetchOrgJoinRequests = () => {
    startTransition(async () => {
      try {
        const res = await getOrgJoinRequests()
        if (!res?.data.length) return
        setData(res.data as OrgJoinRequestT[])
        setCount(res.count || 0)
      } catch (e: unknown) {
        toast.error((e as Error)?.message)
      }
    })
  }

  useEffect(() => {
    fetchOrgJoinRequests()
  }, [])

  return (
    <Box>
      <Filters />
      <Datagrid
        isLoading={isLoading}
        data={data}
        count={count}
        onOpenDialog={onOpenDialog}
      />
      <DialogAcceptRequestUser
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
      />
    </Box>
  )
}

export default OrgJoinRequestList

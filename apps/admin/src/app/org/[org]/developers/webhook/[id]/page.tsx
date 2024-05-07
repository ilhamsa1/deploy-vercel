import { getUserAuth } from '@/models/organizations/actions'
import { redirect } from 'next/navigation'
import WebhooksDetail from './_components'

export default async function WebhooksDetailPage({ params }: { params: { id: string } }) {
  const data = await getUserAuth()

  if (!data) {
    redirect('/org')
  }

  return (
    <WebhooksDetail
      id={params?.id}
      user={data?.user || undefined}
    />
  )
}

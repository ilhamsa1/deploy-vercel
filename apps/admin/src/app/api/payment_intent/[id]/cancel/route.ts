import { NextResponse } from 'next/server'

import { createClientWithAuthHeader } from '@/utils/supabase/server'

// Change the dynamic behavior of a layout or page to fully static or fully dynamic. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'auto'
// Set the default revalidation time for a layout or page. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 0
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache
export const fetchCache = 'auto'

export async function POST(_request: Request, context: { params: { id: string } }) {
  const supabase = createClientWithAuthHeader()

  const paymentIntentId = context.params.id

  const { data } = await supabase.rpc('cancel_payment_intent', {
    payment_intent_id: paymentIntentId,
  })

  return NextResponse.json({ data })
}

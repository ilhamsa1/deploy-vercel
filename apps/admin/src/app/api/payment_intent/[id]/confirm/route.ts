import { NextResponse } from 'next/server'
import zod from 'zod'

import { processAmountWithCurrency } from '@/lib/common'
import { createClientWithAuthHeader } from '@/utils/supabase/server'

// Change the dynamic behavior of a layout or page to fully static or fully dynamic. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'auto'
// Set the default revalidation time for a layout or page. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
export const revalidate = 0
// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache
export const fetchCache = 'auto'

export async function POST(request: Request, context: { params: { id: string } }) {
  const supabase = createClientWithAuthHeader()
  const params = await request.json()
  await validatePost(params)

  const { currency, transactedAt, paymentMethod, ...item } = params
  const { amount, amount_e } = processAmountWithCurrency(item.amount, currency)
  const paymentIntentId = context.params.id

  const { data } = await supabase.rpc('confirm_payment_manually', {
    payment_intent_id: paymentIntentId,
    payment_method: paymentMethod, //optional
    bank_tx_selector: {
      amount,
      amount_e,
      currency,
      transacted_at: transactedAt,
    },
  })

  return NextResponse.json({ data })
}

export const validatePost = async (payload: zod.infer<typeof FormSchema>) => {
  const validationResult = (await FormSchema.safeParse(payload)) as { error?: string }

  if (validationResult.error) {
    throw new Error(validationResult.error)
  }
}

const FormSchema = zod.object({
  currency: zod.string(),
  amount: zod.number().or(zod.string().nonempty()),
})

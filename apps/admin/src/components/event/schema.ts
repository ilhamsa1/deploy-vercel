import { z } from 'zod'

export const FormSchemaWebHooks = z.object({
  url: z
    .string()
    .min(1, { message: 'Endpoint URL is required' })
    .url({ message: 'The Endpoint URL format is incorrect.' }),
  description: z.string(),
  api_version: z.string(),
  enabled_events: z.array(z.string()).min(1, { message: 'Min. 1 row events' }),
})

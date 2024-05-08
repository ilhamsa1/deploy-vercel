import { ComponentType } from 'react'
import Stack from '@mui/material/Stack'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'

import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'

import CheckboxGroupEvents from '@/components/event/checkbox-group'

import { FormSchemaWebHooks } from './schema'

type Props = {
  formHook: UseFormReturn<z.infer<typeof FormSchemaWebHooks>>
}

const FormWebHook: ComponentType<Props> = ({ formHook }) => {
  return (
    <Form {...formHook}>
      <Stack spacing={2}>
        <FormField
          control={formHook.control}
          name="url"
          render={({ field }) => (
            <FormItem style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Endpoint URL"
                required
                fullWidth
                {...field}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formHook.control}
          name="description"
          render={({ field }) => (
            <FormItem style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Description"
                fullWidth
                {...field}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formHook.control}
          name="api_version"
          render={({ field }) => (
            <FormItem style={{ width: '100%' }}>
              <TextField
                variant="outlined"
                label="Payload Format Version"
                fullWidth
                {...field}
                onChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <CheckboxGroupEvents control={formHook?.control} />
      </Stack>
    </Form>
  )
}

export default FormWebHook

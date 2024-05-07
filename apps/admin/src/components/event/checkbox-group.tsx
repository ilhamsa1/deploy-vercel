import { ComponentType } from 'react'
import { z } from 'zod'

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material'
import { Control, ControllerRenderProps } from 'react-hook-form'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import { EVENTS } from '@/lib/constant'
import { FormField, FormItem, FormMessage } from '@/components/form'
import { FormSchemaWebHooks } from './schema'

type Props = {
  control: Control<z.infer<typeof FormSchemaWebHooks>>
}

const CheckboxGroupEvents: ComponentType<Props> = ({ control }) => {
  const handleEventSelection = (
    field: ControllerRenderProps<z.infer<typeof FormSchemaWebHooks>>,
    eventKey: string,
    eventType: string,
  ) => {
    const eventWithType = field.value as string[]
    const isSelected = eventWithType.some((event: string) => event === `${eventKey}.${eventType}`)

    const updatedEvents = isSelected
      ? eventWithType.filter((event: string) => event !== `${eventKey}.${eventType}`)
      : [...field.value, `${eventKey}.${eventType}`]

    field.onChange(updatedEvents)
  }

  const handleSelectAllEvents = (
    field: ControllerRenderProps<z.infer<typeof FormSchemaWebHooks>>,
    eventKey?: string,
  ) => {
    const eventWithType = field.value as string[]

    if (eventKey) {
      const selectedEventTypeKeys = eventWithType
        .filter((event: string) => event.startsWith(`${eventKey}.`))
        .map((event: string) => event.split('.')[1]) // Extract event type from event key

      const allEventTypes =
        EVENTS.find((event) => event.key === eventKey)?.event_types.map((event) => event.type) || []

      const newSelectedEvents =
        selectedEventTypeKeys.length === allEventTypes.length
          ? eventWithType.filter((event: string) => !event.startsWith(`${eventKey}.`)) // Deselect all if all selected
          : [
              ...eventWithType.filter((event: string) => !event.startsWith(`${eventKey}.`)),
              ...allEventTypes.map((type) => `${eventKey}.${type}`),
            ] // Select all

      field.onChange(newSelectedEvents)
    } else {
      const allEventsSelected =
        field.value.length === EVENTS.flatMap((event) => event.event_types).length

      field.onChange(
        allEventsSelected
          ? []
          : EVENTS.flatMap((event) =>
              event.event_types.map((event_type) => `${event.key}.${event_type.type}`),
            ),
      )
    }
  }

  return (
    <FormField
      control={control}
      name="enabled_events"
      render={({ field }) => (
        <FormItem style={{ width: '100%' }}>
          <Typography variant="h5">Select Event</Typography>
          <FormControlLabel
            value="end"
            control={
              <Checkbox
                size="small"
                checked={field.value.length === EVENTS.flatMap((event) => event.event_types).length}
                onChange={() => handleSelectAllEvents(field)}
              />
            }
            label="Select all events"
            labelPlacement="end"
          />
          {EVENTS.map((event) => (
            <Accordion key={event.key}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{ textTransform: 'capitalize' }}
              >
                {event.title}
              </AccordionSummary>
              <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  value="end"
                  control={
                    <Checkbox
                      size="small"
                      checked={event.event_types.every((event_type) =>
                        field.value.includes(`${event.key}.${event_type.type}`),
                      )}
                      onChange={() => handleSelectAllEvents(field, event.key)}
                    />
                  }
                  label={`Select all ${event.title}`}
                  labelPlacement="end"
                />
                {event.event_types.map((event_type) => (
                  <FormControlLabel
                    value="end"
                    control={
                      <Checkbox
                        size="small"
                        checked={field.value.includes(`${event.key}.${event_type.type}`)}
                        onChange={() => handleEventSelection(field, event.key, event_type.type)}
                      />
                    }
                    sx={{ alignItems: 'flex-start' }}
                    label={
                      <>
                        <Typography sx={{ mt: '5px' }}>
                          {`${event.key}.${event_type.type}`}
                        </Typography>
                        <FormHelperText>{event_type.description}</FormHelperText>
                      </>
                    }
                    labelPlacement="end"
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CheckboxGroupEvents

import { ComponentType, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Stack from '@mui/material/Stack'

import Dialog from '@/components/dialog'
import TextField from '@/components/textfield'
import { FormField, FormItem, FormMessage, Form } from '@/components/form'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { EVENTS } from '@/lib/constant'

type Props = {
  openDialog: boolean
  onCloseDialog: () => void
}

const FormSchema = z.object({
  url: z.string().min(1, { message: 'Endpoint URL is required' }),
  description: z.string(),
  api_version: z.string(),
})

const DialogAddWebHook: ComponentType<Props> = ({ openDialog, onCloseDialog }) => {
  const [isLoading, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: '',
      description: '',
      api_version: '',
    },
  })

  const [selectedEvents, setSelectedEvents] = useState<string[]>([])

  const handleEventSelection = (eventKey: string, eventType: string) => {
    const isSelected = selectedEvents.some((event) => event === `${eventKey}.${eventType}`)

    const updatedEvents = isSelected
      ? selectedEvents.filter((event) => event !== `${eventKey}.${eventType}`)
      : [...selectedEvents, `${eventKey}.${eventType}`]

    setSelectedEvents(updatedEvents)
  }

  const handleSelectAllEvents = (eventKey?: string) => {
    if (eventKey) {
      const selectedEventTypeKeys = selectedEvents
        .filter((event) => event.startsWith(`${eventKey}.`))
        .map((event) => event.split('.')[1]) // Extract event type from event key

      const allEventTypes =
        EVENTS.find((event) => event.key === eventKey)?.event_types.map((event) => event.type) || []

      const newSelectedEvents =
        selectedEventTypeKeys.length === allEventTypes.length
          ? selectedEvents.filter((event) => !event.startsWith(`${eventKey}.`)) // Deselect all if all selected
          : [
              ...selectedEvents.filter((event) => !event.startsWith(`${eventKey}.`)),
              ...allEventTypes.map((type) => `${eventKey}.${type}`),
            ] // Select all

      setSelectedEvents(newSelectedEvents)
    } else {
      const allEventsSelected =
        selectedEvents.length === EVENTS.flatMap((event) => event.event_types).length

      setSelectedEvents(
        allEventsSelected
          ? []
          : EVENTS.flatMap((event) =>
              event.event_types.map((event_type) => `${event.key}.${event_type.type}`),
            ),
      )
    }
  }

  const onSubmit = async () => {
    startTransition(async () => {
      try {
        onCloseDialog()
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown Error'
        toast.error(message)
      }
    })
  }

  return (
    <Dialog
      open={openDialog}
      onAccept={form.handleSubmit(onSubmit)}
      onClose={onCloseDialog}
      title="Add endpoint"
      acceptLabel="Add endpoint"
      loadingButton={isLoading}
      fullWidth
    >
      <Form {...form}>
        <Stack spacing={2}>
          <FormField
            control={form.control}
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
            control={form.control}
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
            control={form.control}
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
          <FormItem style={{ width: '100%' }}>
            <Typography variant="h5">Select Event</Typography>
            <FormControlLabel
              value="end"
              control={
                <Checkbox
                  size="small"
                  checked={
                    selectedEvents.length === EVENTS.flatMap((event) => event.event_types).length
                  }
                  onChange={() => handleSelectAllEvents()}
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
                          selectedEvents.includes(`${event.key}.${event_type.type}`),
                        )}
                        onChange={() => handleSelectAllEvents(event.key)}
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
                          checked={selectedEvents.includes(`${event.key}.${event_type.type}`)}
                          onChange={() => handleEventSelection(event.key, event_type.type)}
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
          </FormItem>
        </Stack>
      </Form>
    </Dialog>
  )
}

export default DialogAddWebHook

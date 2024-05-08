import { Stack, Typography, Box } from '@mui/material'
import { grey, deepPurple } from '@mui/material/colors'

interface PayloadComponentProps {
  jsonData: unknown // Use unknown for better type safety, forcing type checks
  title?: string // Optional prop, default value provided
}

const Payload = ({ jsonData, title = 'Response' }: PayloadComponentProps) => {
  return (
    <Stack sx={{ bgcolor: grey[100], width: '100%', p: 2, borderRadius: 2, boxShadow: 1 }}>
      <Typography
        variant="h6"
        sx={{ color: deepPurple[700] }}
      >
        {title}
      </Typography>
      <Box sx={{ overflowX: 'auto', p: 1, bgcolor: grey[300], borderRadius: 1 }}>
        <pre
          style={{
            fontFamily: 'Monospace',
            fontSize: '0.875rem',
            margin: 0,
            whiteSpace: 'pre-wrap',
          }}
        >
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      </Box>
    </Stack>
  )
}

export default Payload

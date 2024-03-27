import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxe Homepage',
}

export default async function IndexPage() {
  return (
    <Box>
      <Box>
        <Typography>Bank Scan</Typography>
      </Box>
    </Box>
  )
}

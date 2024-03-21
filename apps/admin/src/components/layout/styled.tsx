import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

export const RootContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
})

export const AppContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  position: 'relative',
  maxHeight: '100vh',
  overflow: 'auto',
  padding: 0,
})

export const PageContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

export const ContentContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  position: 'relative',
})

export const ContainerDetail = styled(Stack)({
  flex: 1,
  flexDirection: 'column',
  width: '100%',
  maxWidth: '1200px',
  margin: 'auto',
  padding: '1rem 1.5rem',
})

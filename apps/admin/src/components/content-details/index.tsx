import Stack, { StackProps } from '@mui/material/Stack'
import React, { ReactNode, useMemo } from 'react'

import { spacings } from '../../theme'
import { palette } from '../../theme/colors'
import Typography, { TypographyProps } from '../typography'

interface Props {
  label: string
  item: ReactNode
  isRow?: boolean
  isEmail?: boolean
  endAdornment?: ReactNode
  variantLabel?: TypographyProps['variant']
  itemsAlignment?: 'left' | 'right'
}

const ContentDetails = ({
  label,
  item,
  isRow,
  isEmail,
  endAdornment,
  variantLabel = 'subtitle2',
  itemsAlignment,
}: Props) => {
  const isReactElement = React.isValidElement(item)

  const justifyContent = useMemo<StackProps['alignItems']>(() => {
    if (!itemsAlignment) {
      return 'flex-start'
    }

    return itemsAlignment === 'left' ? 'flex-start' : 'flex-end'
  }, [itemsAlignment])

  return (
    <Stack
      direction={{
        xs: 'column',
        sm: isRow ? 'row' : 'column',
      }}
      gap={spacings[200]}
      alignItems={{
        xs: 'flex-start',
        sm: isRow ? 'center' : undefined,
      }}
    >
      <Typography
        variant={variantLabel}
        fontWeight="semiBold"
        width="100%"
        maxWidth="240px"
      >
        {label}
      </Typography>

      <Stack
        direction="row"
        gap={spacings[600]}
        justifyContent={justifyContent}
        alignItems="center"
        width="100%"
      >
        {isReactElement ? (
          item
        ) : (
          <Typography
            variant="subtitle2"
            textTransform={isEmail ? 'lowercase' : 'capitalize'}
            color={palette.common.neutral600}
            whiteSpace="pre-wrap"
          >
            {item || 'N/A'}
          </Typography>
        )}

        {endAdornment}
      </Stack>
    </Stack>
  )
}

export default ContentDetails

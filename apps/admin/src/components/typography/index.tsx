import MUITypography from '@mui/material/Typography'
import { CSSProperties, ComponentProps, forwardRef } from 'react'

import { FONTS, fontWeight as themeFontWeight } from '../../theme'

type MuiTypographyProps = ComponentProps<typeof MUITypography>

export type TypographyProps = Omit<MuiTypographyProps, 'fontWeight' | 'variant'> & {
  fontWeight?: keyof typeof themeFontWeight
  variant?:
    | MuiTypographyProps['variant']
    | 'body3'
    | 'fieldTitle'
    | 'fieldDescription'
    | 'fieldDescription2'
    | 'fieldPlaceholder'
}

const Typography = forwardRef<HTMLElement, TypographyProps>(function TypographyFR(
  { fontWeight, variant, sx, ...props },
  ref,
) {
  const _fontWeight = fontWeight ? themeFontWeight[fontWeight] : themeFontWeight.regular
  const _variant = variant ? muiVariantMapping[variant] : variant

  const typographySx = variant ? customVariantSx[variant] : {}

  return (
    <MUITypography
      {...props}
      ref={ref}
      variant={_variant}
      sx={[sx as CSSProperties, typographySx, { fontWeight: _fontWeight }]}
    />
  )
})

const muiVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'subtitle1',
  subtitle2: 'subtitle2',
  body1: 'body1',
  body2: 'body2',
  body3: 'body2',
  button: 'button',
  caption: 'caption',
  inherit: 'inherit',
  overline: 'overline',
  fieldTitle: 'h6',
  fieldDescription: 'body1',
  fieldDescription2: 'body2',
  fieldPlaceholder: 'body1',
} as Record<NonNullable<TypographyProps['variant']>, MuiTypographyProps['variant']>

const customVariantSx = {
  h1: FONTS.h1,
  h2: FONTS.h2,
  h3: FONTS.h3,
  h4: FONTS.h4,
  h5: FONTS.h5,
  h6: FONTS.h6,
  body1: FONTS.body1,
  body2: FONTS.body2,
  subtitle1: FONTS.subtitle1,
  subtitle2: FONTS.subtitle2,
  fieldTitle: FONTS.fieldTitle,
  fieldDescription: FONTS.fieldDescription,
  fieldDescription2: FONTS.fieldDescription2,
  fieldPlaceholder: FONTS.caption,
} as Record<NonNullable<TypographyProps['variant']>, CSSProperties>

export default Typography

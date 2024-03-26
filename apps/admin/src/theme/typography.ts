import { TypographyVariantsOptions } from '@mui/material/styles'
import { CSSProperties } from 'react'

export const bodyFont = "'Open Sans Variable', sans-serif"
export const mainFont = "'Open Sans Variable', sans-serif"
export const secondFont = "'Open Sans Variable', sans-serif"

export const fontWeight = {
  light: 300,
  regular: 400,
  semiBold: 600,
  bold: 700,
} as const

type Fonts = Record<keyof TypographyVariantsOptions, CSSProperties> & {
  body3: CSSProperties
  btnLarge: CSSProperties
  btnNormal: CSSProperties
  btnMedium: CSSProperties
  btnSmall: CSSProperties
  btnExtraSmall: CSSProperties
  fieldPlaceholder: CSSProperties
  fieldTitle: CSSProperties
  fieldDescription: CSSProperties
  fieldDescription2: CSSProperties
}

export const FONTS: Partial<Fonts> = {
  // Headers

  h1: {
    fontFamily: mainFont,
    fontSize: '3.5rem', // 56px
    fontWeight: fontWeight.semiBold,
  },
  h2: {
    fontFamily: mainFont,
    fontSize: '3rem', // 48px
    fontWeight: fontWeight.semiBold,
  },
  h3: {
    fontFamily: mainFont,
    fontSize: '2rem', // 32px
    fontWeight: fontWeight.semiBold,
  },
  h4: {
    fontFamily: mainFont,
    fontSize: '1.5rem', // 24px
    fontWeight: fontWeight.semiBold,
  },
  h5: {
    fontFamily: mainFont,
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeight.semiBold,
  },
  h6: {
    fontFamily: mainFont,
    fontSize: '1rem', // 16px
    fontWeight: fontWeight.semiBold,
  },

  // Subtitle

  subtitle1: {
    fontFamily: mainFont,
    fontSize: '1.25rem', // 20px
    fontWeight: fontWeight.semiBold,
  },
  subtitle2: {
    fontFamily: mainFont,
    fontSize: '1rem', // 16px
    fontWeight: fontWeight.semiBold,
  },

  // Body/Paragraph

  body1: {
    fontFamily: bodyFont,
    fontSize: '1.125rem', // 18px
    fontWeight: fontWeight.light,
  },
  body2: {
    fontFamily: bodyFont,
    fontSize: '1rem', // 16px
    fontWeight: fontWeight.light,
  },
  body3: {
    fontFamily: bodyFont,
    fontSize: '0.875rem',
    fontWeight: fontWeight.light,
  },

  // Buttons

  btnLarge: {
    fontFamily: bodyFont,
    fontSize: '1.25rem',
    fontWeight: fontWeight.semiBold,
  },
  btnNormal: {
    fontFamily: bodyFont,
    fontSize: '1.125rem',
    fontWeight: fontWeight.semiBold,
  },
  btnMedium: {
    fontFamily: bodyFont,
    fontSize: '1rem',
    fontWeight: fontWeight.semiBold,
  },
  btnSmall: {
    fontFamily: bodyFont,
    fontSize: '0.875rem',
    fontWeight: fontWeight.semiBold,
  },
  btnExtraSmall: {
    fontFamily: bodyFont,
    fontSize: '0.75rem',
    fontWeight: fontWeight.semiBold,
  },

  // Fields

  fieldPlaceholder: {
    fontFamily: bodyFont,
    fontSize: '1rem', // 16px
    fontWeight: fontWeight.regular,
  },
  fieldTitle: {
    fontFamily: bodyFont,
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeight.regular,
  },
  fieldDescription: {
    fontFamily: bodyFont,
    fontSize: '0.875rem', // 14px
    fontWeight: fontWeight.regular,
  },
  fieldDescription2: {
    fontFamily: bodyFont,
    fontSize: '0.75rem', // 12px
    fontWeight: fontWeight.regular,
  },
}

export const typography: TypographyVariantsOptions = {
  fontFamily: [mainFont, bodyFont].join(','),
  htmlFontSize: 16,
  fontSize: 16,
  h1: { ...FONTS.h1 },
  h2: { ...FONTS.h2 },
  h3: { ...FONTS.h3 },
  h4: { ...FONTS.h4 },
  h5: { ...FONTS.h5 },
  h6: { ...FONTS.h6 },
  body1: { ...FONTS.body1 },
  body2: { ...FONTS.body2 },
  subtitle1: { ...FONTS.subtitle1 },
  subtitle2: { ...FONTS.subtitle2 },
}

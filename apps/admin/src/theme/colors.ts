export const colors = {
  // Primary
  primary50: '#ffe9ec',
  primary100: '#ffc7cc',
  primary200: '#fa908d',
  primary300: '#f26260',
  primary400: '#fb3536',
  primary500: '#ff0c0c',
  primary600: '#f10011',
  primary700: '#df000c',
  primary800: '#d30002',
  primary900: '#c50000',
  primaryText: '#121212',

  // Secondary
  secondary50: '#eee6f9',
  secondary100: '#d3c1ef',
  secondary200: '#b698e5',
  secondary300: '#986edb',
  secondary400: '#814cd3',
  secondary500: '#6829cb',
  secondary600: '#5e24c5',
  secondary700: '#4f1bbc',
  secondary800: '#4014b5',
  secondary900: '#2200ab',
  secondaryText: '#121212',

  // Backgrounds
  white: '#FFFFFF',
  grey: '#F1F1F1',
  cream: '#F2F4F8',
  disabled: '#E4E4E4',
  regentGrey: '#808E9E',
  dimGrey: '#727272',
  purple: '#941F7F',

  // Text & Icon
  textBlack: '#121212',
  textWhite: '#FFFFFF',
  textGrey: '#7A7A7A',
  textLightGrey: '#D8D8D8',
  textDisabled: '#C9C9C9',
  textWarning: '#FFB82E',
  textError: '#F93232',
  textSuccess: '#439F6E ',

  // Fields
  field: '#FFFFFF',
  fieldStroke: '#E3E2E7',
  fieldTitle: '#8A8894',
  fieldText: '#121212',
  fieldDescription: '#8A8894',
  fieldStrokeHover: '#121212',
  fieldDisabled: '#E3E2E7',
  fieldStrokeDisabled: '#E3E2E7',
  fieldTextDisabled: '#CACACE',
  fieldBgError: '#FFFFFF',
  fieldStrokeError: '#F93232',
  fieldDescriptionError: '#F93232',

  // Stroke
  strokeFocus: '#121212',
  strokeGrey: '#E3E2E7',
  strokeError: '#F93232',
  strokeHover: '#185E57',
  strokeClick: '#134A44',

  // Status

  // Other
  softError: '#ffc6c6',
  darkGreen: '#00720B',
  bgDarkGreen: '#003305',
  dutchWhite: '#FFF3D8',

  neutral0: '#FFFFFF',
  neutral100: '#FFFFFF',
  neutral200: '#EEEEEE',
  neutral300: '#E0E0E0',
  neutral400: '#BDBDBD',
  neutral500: '#9E9E9E',
  neutral600: '#757575',
  neutral700: '#616161',
  neutral800: '#424242',
  neutral900: '#212121',
}

export const palette = {
  common: colors,
  primary: {
    light: colors.primary200,
    main: colors.primary500,
    dark: colors.primary700,
    contrastText: colors.primaryText,
  },
  secondary: {
    light: colors.secondary500,
    main: colors.secondary900,
    contrastText: colors.secondaryText,
  },
  error: {
    main: colors.textError,
    contrastText: colors.textWhite,
  },
  text: {
    primary: colors.textBlack,
    white: colors.textWhite,
  },
  background: {
    default: colors.cream,
  },
}

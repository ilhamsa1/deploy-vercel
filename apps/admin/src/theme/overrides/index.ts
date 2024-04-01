import { Components } from '@mui/material/styles'

import { borderRadius } from '../border-radius'
import { colors } from '../colors'
import { spacings } from '../spacings'
import { FONTS } from '../typography'
import { MuiInputField, MuiTextField, MuiFilledInput } from './input-field'
import { MuiPaper } from './paper'
import { MuiAlert } from './alert'

export const overrides: Components = {
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        minHeight: '48px !important',
      },
      content: {
        margin: '8px 0 !important',
      },
    },
  },

  MuiAlert,

  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        // borderBottom: `1px solid ${colors.strokeGrey}`,
      },
    },
  },

  MuiBadge: {
    styleOverrides: {
      badge: {
        borderRadius: `${borderRadius[100]} !important`,
      },
    },
  },

  MuiButtonBase: {
    defaultProps: {
      // The props to change the default for.
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },

  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: spacings[600],
      },
    },
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        padding: spacings[600],
        ...FONTS.subtitle1,
      },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: colors.strokeGrey,
      },
    },
  },

  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginLeft: 0,
      },
    },
  },

  MuiLink: {
    defaultProps: {
      color: 'secondary',
    },
    styleOverrides: {
      root: {
        textDecoration: 'none',
      },
    },
  },

  MuiListItemIcon: {
    styleOverrides: {
      root: {
        color: 'inherit',
      },
    },
  },

  MuiPaper,
  MuiOutlinedInput: MuiInputField,
  MuiTextField,
  MuiFilledInput,
}

import { CSSProperties } from 'react'

type ShadowType = 'base' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'inner'

export const shadows: Record<ShadowType, Partial<CSSProperties>> = {
  inner: {
    boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
  },
  base: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06), inset 0px 0px 1px rgba(0, 0, 0, 0.24)',
  },
  xsmall: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.06), inset 0px 0px 1px rgba(0, 0, 0, 0.24)',
  },
  small: {
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.1)',
  },
  medium: {
    boxShadow: '0px 1px 12px rgba(0, 0, 0, 0.06), 0px 3px 4px rgba(0, 0, 0, 0.08)',
  },
  large: {
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.04), 0px 8px 12px rgba(0, 0, 0, 0.1)',
  },
  xlarge: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.06), 0px 18px 28px rgba(0, 0, 0, 0.1)',
  },
}

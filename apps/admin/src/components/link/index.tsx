import React, { forwardRef } from 'react'
import { SxProps } from '@mui/system'
import MuiLink from '@mui/material/Link'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

interface LinkProps extends NextLinkProps {
  ref: any
  children?: React.ReactNode
  sx?: SxProps
  target?: string
  color?: string
  withoutUnderline?: boolean
}

// Next Link doesnt need the <a> tag anymore
// https://nextjs.org/docs/app/api-reference/components/link#version-history
function Link({ ref, withoutUnderline = false, ...props }: LinkProps) {
  const { href, target, ...other } = props
  if (!href) {
    return <span {...other} />
  }

  return (
    <MuiLink
      component={NextLink}
      ref={ref}
      href={href as string}
      target={target}
      sx={{
        textDecoration: withoutUnderline ? 'none' : 'underline',
      }}
      {...other}
    />
  )
}

export default forwardRef<HTMLAnchorElement, LinkProps>(function AppLink(props, ref) {
  return (
    <Link
      {...props}
      ref={ref}
    />
  )
})

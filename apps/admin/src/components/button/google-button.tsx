'use client'

import { ComponentType } from 'react'
import { createClient } from '@/utils/supabase/client'

import Button from '.'

interface Props {
  nextUrl?: string
}

const GoogleButton: ComponentType<Props> = ({ nextUrl }) => {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl || ''}`,
      },
    })
  }
  return <Button onClick={handleLogin}>Login With google</Button>
}

export default GoogleButton

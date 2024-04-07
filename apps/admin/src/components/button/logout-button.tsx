'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Button from '.'

const LogoutButton = () => {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outlined"
      size="small"
    >
      Logout
    </Button>
  )
}
export default LogoutButton

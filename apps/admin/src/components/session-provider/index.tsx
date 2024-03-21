import { auth } from '../../config/auth'
import WrapperProvider from '../wrapper'

export default async function SessionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) return null

  return <WrapperProvider session={session}>{children}</WrapperProvider>
}

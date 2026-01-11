import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error('Unauthorized')
  return session
}

export async function requireEditor() {
  const session = await requireSession()
  const role = (session.user as any)?.role
  if (!role) throw new Error('Forbidden')
  if (role !== 'ADMIN' && role !== 'EDITOR') throw new Error('Forbidden')
  return session
}

export async function requireAdmin() {
  const session = await requireSession()
  const role = (session.user as any)?.role
  if (role !== 'ADMIN') throw new Error('Forbidden')
  return session
}

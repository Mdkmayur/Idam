import { prisma } from '@/lib/prisma'
import { AlbumMediaSchema } from '@/lib/validators'
import { requireAdmin, requireEditor } from '@/lib/authz'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = AlbumMediaSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const m = parsed.data
  const updated = await prisma.albumMedia.update({ where: { id: params.id }, data: { ...m, caption: (m.caption || '').trim() || null } })
  return Response.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return new Response('Forbidden', { status: 403 }) }
  await prisma.albumMedia.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}

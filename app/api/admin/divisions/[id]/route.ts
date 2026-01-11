import { prisma } from '@/lib/prisma'
import { DivisionSchema } from '@/lib/validators'
import { requireAdmin, requireEditor } from '@/lib/authz'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = DivisionSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })

  const updated = await prisma.division.update({ where: { id: params.id }, data: parsed.data })
  return Response.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return new Response('Forbidden', { status: 403 }) }
  await prisma.division.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}

import { prisma } from '@/lib/prisma'
import { ProjectSchema } from '@/lib/validators'
import { requireAdmin, requireEditor } from '@/lib/authz'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = ProjectSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const p = parsed.data
  const updated = await prisma.project.update({
    where: { id: params.id },
    data: {
      country: p.country,
      divisionId: p.divisionId,
      title: p.title,
      slug: p.slug,
      summary: p.summary,
      description: p.description,
      location: p.location || null,
      heroUrl: p.heroUrl || null,
      tags: p.tags,
      sortOrder: p.sortOrder,
      isFeatured: p.isFeatured,
    },
  })
  return Response.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin() } catch { return new Response('Forbidden', { status: 403 }) }
  await prisma.project.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}

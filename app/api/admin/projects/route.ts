import { prisma } from '@/lib/prisma'
import { ProjectSchema } from '@/lib/validators'
import { requireEditor } from '@/lib/authz'

export async function GET() {
  const items = await prisma.project.findMany({
    include: { division: true },
    orderBy: [{ country: 'asc' }, { divisionId: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return Response.json(items)
}

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = ProjectSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const p = parsed.data
  const created = await prisma.project.create({
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
  return Response.json(created)
}

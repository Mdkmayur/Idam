import { prisma } from '@/lib/prisma'
import { ProjectMediaSchema } from '@/lib/validators'
import { requireEditor } from '@/lib/authz'

export async function GET() {
  const items = await prisma.projectMedia.findMany({
    include: { project: { include: { division: true } } },
    orderBy: [{ projectId: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return Response.json(items)
}

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = ProjectMediaSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const m = parsed.data
  const created = await prisma.projectMedia.create({ data: { ...m, caption: (m.caption || '').trim() || null } })
  return Response.json(created)
}

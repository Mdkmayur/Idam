import { prisma } from '@/lib/prisma'
import { requireEditor } from '@/lib/authz'
import { z } from 'zod'

const ReorderSchema = z.object({
  items: z.array(z.object({ id: z.string().min(5), sortOrder: z.number().int() })).min(1),
})

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = ReorderSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })

  await prisma.$transaction(
    parsed.data.items.map((it) => prisma.projectMedia.update({ where: { id: it.id }, data: { sortOrder: it.sortOrder } }))
  )

  return Response.json({ ok: true })
}

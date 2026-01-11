import { prisma } from '@/lib/prisma'
import { AlbumMediaSchema } from '@/lib/validators'
import { requireEditor } from '@/lib/authz'

export async function GET() {
  const items = await prisma.albumMedia.findMany({ include: { album: true }, orderBy: [{ albumId: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }] })
  return Response.json(items)
}

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = AlbumMediaSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const m = parsed.data
  const created = await prisma.albumMedia.create({
  data: {
    albumId: m.albumId,
    type: m.type,
    url: m.url,
    caption: (m.caption || "").trim() || null,
    sortOrder: m.sortOrder ?? 0,
  },
})
  return Response.json(created)
}

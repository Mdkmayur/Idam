import { prisma } from '@/lib/prisma'
import { AlbumSchema } from '@/lib/validators'
import { requireEditor } from '@/lib/authz'

export async function GET() {
  const items = await prisma.album.findMany({ include: { division: true }, orderBy: [{ country: 'asc' }, { sortOrder: 'asc' }] })
  return Response.json(items)
}

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = AlbumSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })
  const a = parsed.data
  const created = await prisma.album.create({ data: { ...a } })
  return Response.json(created)
}

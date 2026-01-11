import { prisma } from '@/lib/prisma'
import { DivisionSchema } from '@/lib/validators'
import { requireEditor } from '@/lib/authz'

export async function GET() {
  const items = await prisma.division.findMany({ orderBy: [{ country: 'asc' }, { sortOrder: 'asc' }] })
  return Response.json(items)
}

export async function POST(req: Request) {
  try { await requireEditor() } catch { return new Response('Forbidden', { status: 403 }) }
  const parsed = DivisionSchema.safeParse(await req.json())
  if (!parsed.success) return new Response(JSON.stringify(parsed.error.flatten()), { status: 400 })

  const d = parsed.data
  const created = await prisma.division.create({ data: { ...d } })
  return Response.json(created)
}

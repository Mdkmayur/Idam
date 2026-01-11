import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { z } from 'zod'

const Schema = z.object({
  projectId: z.string().min(5),
  country: z.enum(['INDIA', 'SRILANKA']),
})

export async function POST(req: Request) {
  const parsed = Schema.safeParse(await req.json())
  if (!parsed.success) return new Response('Bad request', { status: 400 })

  const token = cookies().get('idam_vid')?.value
  if (!token) return new Response('No visitor token', { status: 400 })

  const visitor = await prisma.visitor.upsert({
    where: { token },
    update: {},
    create: { token },
    select: { id: true },
  })

  const cutoff = new Date(Date.now() - 6 * 60 * 60 * 1000)
  const existing = await prisma.projectView.findFirst({
    where: { projectId: parsed.data.projectId, visitorId: visitor.id, viewedAt: { gte: cutoff } },
    select: { id: true },
  })
  if (existing) return Response.json({ ok: true, deduped: true })

  await prisma.projectView.create({
    data: { projectId: parsed.data.projectId, visitorId: visitor.id, country: parsed.data.country },
  })

  return Response.json({ ok: true })
}

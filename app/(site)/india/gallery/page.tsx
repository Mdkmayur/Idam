import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function IndiaGalleryPage() {
  const media = await prisma.projectMedia.findMany({
    where: { project: { country: 'INDIA' } },
    orderBy: [{ createdAt: 'desc' }],
    take: 36,
    select: { id: true, type: true, url: true, caption: true },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">INDIA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Gallery</h1>
      <p className="mt-2 text-neutral-600">A curated look at latest project moments.</p>

      <div className="mt-8">
        <div className="grid md:grid-cols-3 gap-4">
          {media.map((m) => (
            <div
              key={m.id}
              className="rounded-3xl border border-idam-plat bg-white overflow-hidden shadow-soft"
            >
              <div className="aspect-[16/10] bg-idam-plat">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.caption ?? 'Media'} className="w-full h-full object-cover" />
              </div>
              {m.caption ? (
                <div className="p-4 text-sm text-neutral-700">{m.caption}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

import ProjectGalleryGrid from '@/components/ProjectGalleryGrid'
import { prisma } from '@/lib/prisma'

export default async function SriLankaGallery() {
  const media = await prisma.projectMedia.findMany({
    where: { project: { country: 'SRILANKA' } },
    orderBy: [{ createdAt: 'desc' }],
    take: 36,
    select: { id: true, type: true, url: true, caption: true },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">SRI LANKA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Gallery</h1>
      <p className="mt-2 text-neutral-600">A live feed of latest media across Sri Lanka projects.</p>
      <div className="mt-8">
        <ProjectGalleryGrid items={media as any} variant="full" />
      </div>
    </main>
  )
}

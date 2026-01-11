import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectGalleryGrid from '@/components/ProjectGalleryGrid'

export default async function IndiaProjectGallery({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findFirst({ where: { country: 'INDIA', slug: params.slug } })
  if (!project) notFound()

  const media = await prisma.projectMedia.findMany({
    where: { projectId: project.id },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, type: true, url: true, caption: true },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">PROJECT GALLERY</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">{project.title}</h1>

      {media.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-idam-plat p-6 text-sm text-neutral-600">
          No gallery media yet.
        </div>
      ) : (
        <div className="mt-8">
          <ProjectGalleryGrid items={media as any} variant="full" />
        </div>
      )}
    </main>
  )
}

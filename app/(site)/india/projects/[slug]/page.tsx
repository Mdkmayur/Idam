import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProjectGalleryGrid from '@/components/ProjectGalleryGrid'
import ProjectViewTracker from '@/components/ProjectViewTracker'
import { safeTags, overlapCount } from '@/lib/related'

export default async function IndiaProjectDetail({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findFirst({
    where: { country: 'INDIA', slug: params.slug },
    include: { division: true },
  })
  if (!project) return notFound()

  const gallery = await prisma.projectMedia.findMany({
    where: { projectId: project.id },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 12,
    select: { id: true, type: true, url: true, caption: true },
  })

  const currentTags = safeTags(project.tags)
  const candidates = await prisma.project.findMany({
    where: { country: 'INDIA', id: { not: project.id } },
    select: { id: true, title: true, summary: true, slug: true, heroUrl: true, location: true, isFeatured: true, sortOrder: true, createdAt: true, divisionId: true, tags: true },
    take: 200,
  })

  const related = candidates
    .map((p) => {
      const t = safeTags(p.tags)
      const tagScore = overlapCount(currentTags, t)
      const sameDivision = p.divisionId === project.divisionId ? 5 : 0
      const featured = p.isFeatured ? 2 : 0
      return { p, score: sameDivision + featured + tagScore * 2 }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if ((a.p.sortOrder ?? 0) !== (b.p.sortOrder ?? 0)) return (a.p.sortOrder ?? 0) - (b.p.sortOrder ?? 0)
      return new Date(b.p.createdAt).getTime() - new Date(a.p.createdAt).getTime()
    })
    .slice(0, 6)
    .map(({ p }) => p)

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <ProjectViewTracker projectId={project.id} country="INDIA" />

      <div className="text-xs tracking-[0.35em] text-idam-gold">{project.division.name.toUpperCase()}</div>
      <h1 className="mt-2 text-3xl md:text-4xl font-semibold text-idam-navy">{project.title}</h1>
      <p className="mt-3 text-neutral-700 max-w-3xl">{project.summary}</p>

      {project.heroUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.heroUrl} alt={project.title} className="mt-8 w-full rounded-3xl border border-idam-plat shadow-soft" />
      ) : null}

      <div className="mt-8 prose-premium">
        <h2>About this project</h2>
        <p>{project.description}</p>
      </div>

      {gallery.length ? (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold text-idam-navy">Project Gallery</h2>
            <Link className="text-sm text-idam-navy hover:underline" href={`/india/projects/${project.slug}/gallery`}>
              View all →
            </Link>
          </div>
          <div className="mt-6">
            <ProjectGalleryGrid items={gallery as any} variant="compact" />
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-idam-navy">Related Projects</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/india/projects/${p.slug}`} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft hover:shadow-md transition">
                <div className="text-sm font-semibold text-idam-navy">{p.title}</div>
                <div className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.summary}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  )
}

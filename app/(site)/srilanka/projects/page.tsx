import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SriLankaProjects() {
  const projects = await prisma.project.findMany({
    where: { country: 'SRILANKA' },
    include: { division: true },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">SRI LANKA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Projects</h1>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/srilanka/projects/${p.slug}`} className="rounded-3xl border border-idam-plat bg-white shadow-soft overflow-hidden hover:shadow-md transition">
            <div className="h-40 bg-idam-plat">
              {p.heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.heroUrl} alt={p.title} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="p-6">
              <div className="text-xs tracking-[0.25em] text-idam-gold">{p.division.name}</div>
              <div className="mt-2 text-lg font-semibold text-idam-navy">{p.title}</div>
              <div className="mt-2 text-sm text-neutral-600 line-clamp-3">{p.summary}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

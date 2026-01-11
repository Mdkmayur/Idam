import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function IndiaProjects() {
  const projects = await prisma.project.findMany({
    where: { country: 'INDIA' },
    include: { division: true },
    orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">INDIA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Projects</h1>
      <p className="mt-2 text-neutral-600">Featured case studies and ongoing work across divisions.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Link key={p.id} href={`/india/projects/${p.slug}`} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft hover:shadow-md transition">
            <div className="text-xs tracking-[0.35em] text-idam-gold">{p.division.name}</div>
            <div className="mt-2 text-xl font-semibold text-idam-navy">{p.title}</div>
            <div className="mt-2 text-neutral-600">{p.summary}</div>
            {p.location ? <div className="mt-4 text-sm text-neutral-500">{p.location}</div> : null}
          </Link>
        ))}
      </div>
    </main>
  )
}

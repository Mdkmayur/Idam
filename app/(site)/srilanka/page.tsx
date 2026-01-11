import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SriLankaHome() {
  const divisions = await prisma.division.findMany({
    where: { country: 'SRILANKA' },
    orderBy: { sortOrder: 'asc' },
  })
  const featured = await prisma.project.findMany({
    where: { country: 'SRILANKA', isFeatured: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 6,
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">SRI LANKA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Idam Sri Lanka</h1>
      <p className="mt-3 text-neutral-600">Corporate, premium, experiential — build and scale across Sri Lanka.</p>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-idam-navy">Divisions</h2>
          <Link href="/srilanka/divisions" className="text-sm text-idam-navy hover:underline">View all →</Link>
        </div>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {divisions.slice(0,6).map(d => (
            <div key={d.id} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
              <div className="text-xs tracking-[0.35em] text-idam-gold">{d.tagline}</div>
              <div className="mt-2 text-lg font-semibold text-idam-navy">{d.name}</div>
              <div className="mt-2 text-sm text-neutral-600">{d.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-idam-navy">Featured Projects</h2>
          <Link href="/srilanka/projects" className="text-sm text-idam-navy hover:underline">View all →</Link>
        </div>
        {featured.length ? (
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {featured.map(p => (
              <Link key={p.id} href={`/srilanka/projects/${p.slug}`} className="rounded-3xl border border-idam-plat bg-white overflow-hidden shadow-soft hover:shadow-md">
                <div className="aspect-[16/10] bg-idam-plat">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {p.heroUrl ? <img src={p.heroUrl} alt={p.title} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="p-6">
                  <div className="text-lg font-semibold text-idam-navy">{p.title}</div>
                  <div className="mt-2 text-sm text-neutral-600 line-clamp-2">{p.summary}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-idam-plat bg-white p-6 text-sm text-neutral-600">No featured projects yet. Add from Admin.</div>
        )}
      </section>
    </main>
  )
}

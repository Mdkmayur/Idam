import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function IndiaHome() {
  const divisions = await prisma.division.findMany({
    where: { country: 'INDIA' },
    orderBy: { sortOrder: 'asc' },
  })
  const featured = await prisma.project.findMany({
    where: { country: 'INDIA', isFeatured: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    take: 6,
  })

  return (
    <main className="bg-idam-plat/30">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-xs tracking-[0.35em] text-idam-gold">INDIA OPERATIONS</div>
        <h1 className="mt-2 text-4xl font-semibold text-idam-navy">Idam India</h1>
        <p className="mt-3 text-neutral-700 max-w-3xl">
          From Bangalore, we deliver technology, agriculture, infrastructure, corporate training, vacation experiences, and imports & exports.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {divisions.map((d) => (
            <Link
              key={d.id}
              href={`/india/divisions#${d.slug}`}
              className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft hover:shadow-md"
            >
              <div className="text-xs tracking-[0.35em] text-idam-gold">DIVISION</div>
              <div className="mt-2 text-lg font-semibold text-idam-navy">{d.name}</div>
              <div className="mt-2 text-sm text-neutral-600">{d.tagline}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-idam-navy">Featured Projects</h2>
          <Link className="text-sm text-idam-navy hover:underline" href="/india/projects">
            View all →
          </Link>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {featured.length ? (
            featured.map((p) => (
              <Link key={p.id} href={`/india/projects/${p.slug}`} className="rounded-3xl border border-idam-plat bg-white overflow-hidden shadow-soft hover:shadow-md">
                <div className="aspect-[16/10] bg-idam-plat">
                  {p.heroUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.heroUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="p-6">
                  <div className="text-xs tracking-[0.35em] text-idam-gold">PROJECT</div>
                  <div className="mt-2 text-lg font-semibold text-idam-navy">{p.title}</div>
                  <div className="mt-2 text-sm text-neutral-600 line-clamp-2">{p.summary}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-3xl border border-idam-plat bg-white p-6 text-sm text-neutral-600 md:col-span-3">
              No featured projects yet. Add projects from Admin and mark them as Featured.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

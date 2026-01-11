import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function IndiaDivisionsPage() {
  const divisions = await prisma.division.findMany({
    where: { country: 'INDIA' },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">INDIA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Divisions</h1>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {divisions.map((d) => (
          <div key={d.id} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
            <div className="text-xs tracking-[0.35em] text-idam-gold">{d.tagline}</div>
            <div className="mt-2 text-xl font-semibold text-idam-navy">{d.name}</div>
            <p className="mt-2 text-sm text-neutral-700">{d.description}</p>

            <div className="mt-5">
              <Link
                className="text-idam-navy hover:underline text-sm"
                href={`/india/projects?division=${d.slug}`}
              >
                View projects →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

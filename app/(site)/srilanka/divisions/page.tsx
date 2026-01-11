import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function SriLankaDivisions() {
  const divisions = await prisma.division.findMany({ where: { country: 'SRILANKA' }, orderBy: { sortOrder: 'asc' } })
  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">SRI LANKA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Divisions</h1>
      <div className="mt-8 grid md:grid-cols-2 gap-4">
        {divisions.map((d) => (
          <div key={d.id} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
            <div className="text-xs tracking-[0.35em] text-idam-gold">{d.tagline}</div>
            <div className="mt-2 text-xl font-semibold text-idam-navy">{d.name}</div>
            <p className="mt-3 text-sm text-neutral-600">{d.description}</p>
            <Link className="mt-4 inline-block text-sm text-idam-navy hover:underline" href={`/srilanka/projects?division=${d.slug}`}>View projects →</Link>
          </div>
        ))}
      </div>
    </main>
  )
}

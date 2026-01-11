import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminAnalytics() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const topProjects = await prisma.projectView.groupBy({
    by: ['projectId', 'country'],
    where: { viewedAt: { gte: since } },
    _count: { projectId: true },
    orderBy: { _count: { projectId: 'desc' } },
    take: 20,
  })

  const projects = await prisma.project.findMany({
    where: { id: { in: topProjects.map((x) => x.projectId) } },
    select: { id: true, title: true, slug: true },
  })

  const map = new Map(projects.map((p) => [p.id, p]))

  const totals = await prisma.projectView.groupBy({
    by: ['country'],
    where: { viewedAt: { gte: since } },
    _count: { country: true },
  })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Analytics</h1>
      <p className="mt-2 text-neutral-600">Last 30 days — deduped per visitor per 6 hours.</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {totals.map((t) => (
          <div key={t.country} className="rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
            <div className="text-xs tracking-[0.3em] text-idam-gold">{t.country}</div>
            <div className="mt-2 text-3xl font-semibold text-idam-navy">{t._count.country}</div>
            <div className="mt-1 text-sm text-neutral-600">Total views</div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-idam-plat bg-white shadow-soft overflow-hidden">
        <div className="p-6 border-b border-idam-plat">
          <div className="text-lg font-semibold text-idam-navy">Top Projects</div>
          <div className="text-sm text-neutral-600">Most viewed projects in last 30 days.</div>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Country</th>
                <th className="py-2">Project</th>
                <th className="py-2">Slug</th>
                <th className="py-2">Views</th>
              </tr>
            </thead>
            <tbody>
              {topProjects.map((x) => {
                const p = map.get(x.projectId)
                return (
                  <tr key={`${x.projectId}-${x.country}`} className="border-t border-idam-plat">
                    <td className="py-3">{x.country}</td>
                    <td className="py-3 font-medium text-idam-navy">{p?.title || x.projectId}</td>
                    <td className="py-3 text-neutral-600">{p?.slug || '-'}</td>
                    <td className="py-3">{x._count.projectId}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

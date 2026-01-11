import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminHome() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Dashboard</h1>
      <p className="mt-2 text-neutral-600">Manage divisions, projects, galleries, enquiries, and analytics.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-4">
        <a className="rounded-3xl border border-idam-plat bg-white shadow-soft p-6 hover:bg-idam-plat/30" href="/admin/projects">
          <div className="text-xs tracking-[0.35em] text-idam-gold">CONTENT</div>
          <div className="mt-2 text-lg font-semibold text-idam-navy">Projects</div>
          <div className="mt-2 text-sm text-neutral-600">Create and manage premium project pages with tags & galleries.</div>
        </a>
        <a className="rounded-3xl border border-idam-plat bg-white shadow-soft p-6 hover:bg-idam-plat/30" href="/admin/project-media">
          <div className="text-xs tracking-[0.35em] text-idam-gold">PORTFOLIO</div>
          <div className="mt-2 text-lg font-semibold text-idam-navy">Project Gallery Media</div>
          <div className="mt-2 text-sm text-neutral-600">Upload images/videos to Cloudinary and reorder.</div>
        </a>
        <a className="rounded-3xl border border-idam-plat bg-white shadow-soft p-6 hover:bg-idam-plat/30" href="/admin/enquiries">
          <div className="text-xs tracking-[0.35em] text-idam-gold">LEADS</div>
          <div className="mt-2 text-lg font-semibold text-idam-navy">Enquiries</div>
          <div className="mt-2 text-sm text-neutral-600">View enquiries captured from India & Sri Lanka sites.</div>
        </a>
        <a className="rounded-3xl border border-idam-plat bg-white shadow-soft p-6 hover:bg-idam-plat/30" href="/admin/analytics">
          <div className="text-xs tracking-[0.35em] text-idam-gold">INSIGHTS</div>
          <div className="mt-2 text-lg font-semibold text-idam-navy">Analytics</div>
          <div className="mt-2 text-sm text-neutral-600">See top projects and views by country.</div>
        </a>
      </div>
    </main>
  )
}

import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const nav = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/divisions', label: 'Divisions' },
    { href: '/admin/projects', label: 'Projects' },
    { href: '/admin/albums', label: 'Albums' },
    { href: '/admin/media', label: 'Album Media' },
    { href: '/admin/project-media', label: 'Project Gallery Media' },
    { href: '/admin/project-media/reorder', label: 'Reorder Project Gallery' },
    { href: '/admin/enquiries', label: 'Enquiries' },
    { href: '/admin/analytics', label: 'Analytics' },
  ]

  return (
    <div className="min-h-screen bg-idam-plat/30">
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="rounded-3xl border border-idam-plat bg-white p-5 shadow-soft h-fit">
          <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
          <div className="mt-2 text-lg font-semibold text-idam-navy">Control Center</div>

          <nav className="mt-6 grid gap-2">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-2xl border border-idam-plat bg-white px-4 py-3 text-sm font-medium text-idam-navy hover:bg-idam-plat/40"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 text-xs text-neutral-500">Theme: Deep Blue + Gold + Platinum</div>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  )
}

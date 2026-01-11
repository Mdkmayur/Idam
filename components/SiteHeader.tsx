import Link from 'next/link'

export default function SiteHeader({
  country,
}: {
  country: 'india' | 'srilanka'
}) {
  const base = country === 'india' ? '/india' : '/srilanka'
  return (
    <header className="border-b border-idam-plat bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href={base} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-idam-navy text-white grid place-items-center font-semibold">I</div>
          <div>
            <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM</div>
            <div className="text-sm font-semibold text-idam-navy">{country === 'india' ? 'India' : 'Sri Lanka'}</div>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-idam-navy hover:underline" href={`${base}/divisions`}>Divisions</Link>
          <Link className="text-idam-navy hover:underline" href={`${base}/projects`}>Projects</Link>
          <Link className="text-idam-navy hover:underline" href={`${base}/gallery`}>Gallery</Link>
          <Link className="rounded-2xl bg-idam-navy text-white px-4 py-2" href={`${base}/enquire`}>Enquire</Link>
        </nav>
      </div>
    </header>
  )
}

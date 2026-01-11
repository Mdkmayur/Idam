export default function SiteFooter({
  address,
}: {
  address: string
}) {
  return (
    <footer className="border-t border-idam-plat bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM GROUP</div>
          <div className="mt-2 text-sm text-neutral-700">Corporate, premium, experiential presence across India and Sri Lanka.</div>
          <div className="mt-4 text-sm text-neutral-600">{address}</div>
        </div>
        <div className="text-sm text-neutral-600 md:text-right">
          <div>© {new Date().getFullYear()} Idam. All rights reserved.</div>
          <div className="mt-2">Theme: Deep blue + gold + platinum.</div>
        </div>
      </div>
    </footer>
  )
}

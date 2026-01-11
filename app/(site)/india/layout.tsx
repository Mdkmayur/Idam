import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function IndiaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader country="india" />
      {children}
      <SiteFooter address="India Base: 2360, 19th Cross, KR Road, Banashankari 2nd Stage, Bangalore 560070" />
    </div>
  )
}

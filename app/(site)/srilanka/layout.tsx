import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export default function SriLankaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader country="srilanka" />
      {children}
      <SiteFooter address="Sri Lanka Base: 429/9/7, Green Glade Park, Gonahena, Kadawatha, Sri Lanka" />
    </div>
  )
}

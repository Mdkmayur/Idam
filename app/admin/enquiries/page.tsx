import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function AdminEnquiries() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const items = await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Enquiries</h1>
      <div className="mt-6 rounded-3xl border border-idam-plat bg-white shadow-soft overflow-hidden">
        <div className="p-6 border-b border-idam-plat text-sm text-neutral-600">Latest 200 messages</div>
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">When</th>
                <th className="py-2">Country</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Division</th>
                <th className="py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-t border-idam-plat">
                  <td className="py-3 pr-2 whitespace-nowrap">{new Date(e.createdAt).toLocaleString()}</td>
                  <td className="py-3 pr-2">{e.country}</td>
                  <td className="py-3 pr-2 font-medium text-idam-navy">{e.name}</td>
                  <td className="py-3 pr-2">{e.email}</td>
                  <td className="py-3 pr-2">{e.phone || '-'}</td>
                  <td className="py-3 pr-2">{e.division || '-'}</td>
                  <td className="py-3 max-w-[420px]">{e.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

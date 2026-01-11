'use client'

import { useEffect, useState } from 'react'
import { AdminCard, AdminTable } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, TextArea, TextInput, DangerButton } from '@/components/FormInput'

type Division = {
  id: string
  country: 'INDIA' | 'SRILANKA'
  name: string
  slug: string
  tagline: string
  description: string
  sortOrder: number
}

export default function AdminDivisions() {
  const [rows, setRows] = useState<Division[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [country, setCountry] = useState<'INDIA'|'SRILANKA'>('INDIA')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/divisions')
    const data = await res.json()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function create() {
    setErr('')
    const res = await fetch('/api/admin/divisions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, name, slug, tagline, description, sortOrder: Number(sortOrder) }),
    })
    if (!res.ok) { setErr('Failed to create division'); return }
    setName(''); setSlug(''); setTagline(''); setDescription(''); setSortOrder(0)
    await load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this division?')) return
    const res = await fetch(`/api/admin/divisions/${id}`, { method: 'DELETE' })
    if (!res.ok) { alert('Delete failed. Only ADMIN can delete.'); return }
    await load()
  }

  return (
    <AdminCard title="Divisions" subtitle="Create and manage divisions per country.">
      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Country</Label>
            <Select value={country} onChange={(e) => setCountry(e.target.value as any)}>
              <option value="INDIA">INDIA</option>
              <option value="SRILANKA">SRILANKA</option>
            </Select>
          </div>
          <div>
            <Label>Sort Order</Label>
            <TextInput type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
          <div>
            <Label>Name</Label>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Information Technology" />
          </div>
          <div>
            <Label>Slug</Label>
            <TextInput value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="information-technology" />
          </div>
          <div>
            <Label>Tagline</Label>
            <TextInput value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Software, Infrastructure & Growth" />
          </div>
          <div>
            <Label>Description</Label>
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Write a premium description" />
          </div>
        </div>

        {err ? <div className="text-sm text-red-700">{err}</div> : null}

        <PrimaryButton onClick={create}>Create Division</PrimaryButton>

        {loading ? (
          <div className="text-sm text-neutral-600">Loading…</div>
        ) : (
          <AdminTable
            columns={["Country","Name","Slug","Sort","Actions"]}
            rows={rows.map((d) => (
              <tr key={d.id} className="border-t border-idam-plat">
                <td className="py-3 px-2">{d.country}</td>
                <td className="py-3 px-2 font-medium text-idam-navy">{d.name}</td>
                <td className="py-3 px-2 text-neutral-600">{d.slug}</td>
                <td className="py-3 px-2">{d.sortOrder}</td>
                <td className="py-3 px-2">
                  <DangerButton onClick={() => remove(d.id)}>Delete</DangerButton>
                </td>
              </tr>
            ))}
          />
        )}
      </div>
    </AdminCard>
  )
}

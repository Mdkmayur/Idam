'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminCard, AdminTable } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, TextArea, TextInput, DangerButton } from '@/components/FormInput'

type Division = { id: string; country: 'INDIA' | 'SRILANKA'; name: string }
type Album = { id: string; country: 'INDIA' | 'SRILANKA'; divisionId: string; title: string; slug: string; description: string; sortOrder: number }

export default function AdminAlbums() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [items, setItems] = useState<Album[]>([])
  const [country, setCountry] = useState<'INDIA' | 'SRILANKA'>('INDIA')
  const [divisionId, setDivisionId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [msg, setMsg] = useState('')

  async function load() {
    const d = await fetch('/api/admin/divisions').then((r) => r.json())
    setDivisions(d)
    const x = await fetch('/api/admin/albums').then((r) => r.json())
    setItems(x)
  }

  useEffect(() => { load() }, [])

  const filteredDivisions = useMemo(() => divisions.filter((d) => d.country === country), [divisions, country])

  async function create() {
    setMsg('')
    const res = await fetch('/api/admin/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, divisionId, title, slug, description, sortOrder }),
    })
    if (!res.ok) {
      setMsg('Failed to create album (check required fields & slug uniqueness).')
      return
    }
    setTitle(''); setSlug(''); setDescription(''); setSortOrder(0)
    await load()
    setMsg('Album created.')
  }

  async function remove(id: string) {
    setMsg('')
    const res = await fetch(`/api/admin/albums/${id}`, { method: 'DELETE' })
    if (!res.ok) { setMsg('Delete failed (ADMIN only).'); return }
    await load()
    setMsg('Deleted.')
  }

  return (
    <main className="px-2 py-2">
      <AdminCard title="Albums" subtitle="Create division-level albums for curated galleries.">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Country</Label>
            <Select value={country} onChange={(e) => setCountry(e.target.value as any)}>
              <option value="INDIA">INDIA</option>
              <option value="SRILANKA">SRILANKA</option>
            </Select>
          </div>
          <div>
            <Label>Division</Label>
            <Select value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
              <option value="">Select</option>
              {filteredDivisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Site Progress" />
          </div>
          <div>
            <Label>Slug</Label>
            <TextInput value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="site-progress" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this album about?" />
          </div>
          <div>
            <Label>Sort Order</Label>
            <TextInput type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <PrimaryButton type="button" onClick={create}>Create Album</PrimaryButton>
          {msg ? <div className="text-sm text-neutral-600">{msg}</div> : null}
        </div>

        <div className="mt-8">
          <AdminTable
            columns={["Country", "Title", "Slug", "Sort", "Actions"]}
            rows={
              items.map((a) => (
                <tr key={a.id} className="border-t border-idam-plat">
                  <td className="py-3 px-2">{a.country}</td>
                  <td className="py-3 px-2 font-medium text-idam-navy">{a.title}</td>
                  <td className="py-3 px-2 text-neutral-600">{a.slug}</td>
                  <td className="py-3 px-2">{a.sortOrder}</td>
                  <td className="py-3 px-2"><DangerButton type="button" onClick={() => remove(a.id)}>Delete</DangerButton></td>
                </tr>
              ))
            }
          />
        </div>
      </AdminCard>
    </main>
  )
}

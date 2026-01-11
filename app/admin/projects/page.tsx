'use client'

import { useEffect, useMemo, useState } from 'react'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import { AdminCard, AdminTable, RowActionLink } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, TextArea, TextInput, SecondaryButton, DangerButton } from '@/components/FormInput'

type Division = { id: string; country: 'INDIA' | 'SRILANKA'; name: string }

type Project = {
  id: string
  country: 'INDIA' | 'SRILANKA'
  divisionId: string
  title: string
  slug: string
  summary: string
  description: string
  location?: string | null
  heroUrl?: string | null
  tags: any
  sortOrder: number
  isFeatured: boolean
  division?: { name: string }
}

export default function AdminProjects() {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [country, setCountry] = useState<'INDIA' | 'SRILANKA'>('INDIA')
  const [divisionId, setDivisionId] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [heroUrl, setHeroUrl] = useState('')
  const [tagsCsv, setTagsCsv] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isFeatured, setIsFeatured] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const divisionOptions = useMemo(() => divisions.filter(d => d.country === country), [divisions, country])

  async function load() {
    const [d, p] = await Promise.all([
      fetch('/api/admin/divisions').then(r=>r.json()),
      fetch('/api/admin/projects').then(r=>r.json())
    ])
    setDivisions(d)
    setProjects(p)
    if (!divisionId && d.length) {
      const first = d.find((x: Division) => x.country === country)
      if (first) setDivisionId(first.id)
    }
  }

  useEffect(() => { load().catch(()=>{}) }, [])

  async function create() {
    setBusy(true)
    setErr('')
    const body = {
      country,
      divisionId,
      title,
      slug,
      summary,
      description,
      location: location || null,
      heroUrl: heroUrl || null,
      tags: tagsCsv.split(',').map(t=>t.trim()).filter(Boolean),
      sortOrder: Number(sortOrder) || 0,
      isFeatured
    }
    const res = await fetch('/api/admin/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setBusy(false)
    if (!res.ok) {
      setErr(await res.text())
      return
    }
    setTitle(''); setSlug(''); setSummary(''); setDescription(''); setLocation(''); setHeroUrl(''); setTagsCsv(''); setSortOrder(0); setIsFeatured(false)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this project?')) return
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    if (!res.ok) { alert(await res.text()); return }
    await load()
  }

  const folder = country === 'INDIA' ? 'idam/india/projects/hero' : 'idam/srilanka/projects/hero'

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
        <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Projects</h1>
      </div>

      <AdminCard title="Create Project" subtitle="Adds a new project under a division. (You can add gallery media separately.)">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Country</Label>
            <Select value={country} onChange={(e)=>setCountry(e.target.value as any)}>
              <option value="INDIA">India</option>
              <option value="SRILANKA">Sri Lanka</option>
            </Select>
          </div>
          <div>
            <Label>Division</Label>
            <Select value={divisionId} onChange={(e)=>setDivisionId(e.target.value)}>
              {divisionOptions.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Title</Label>
            <TextInput value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g., Aalaya Farm Stay Build" />
          </div>
          <div>
            <Label>Slug</Label>
            <TextInput value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="e.g., aalaya-farm-stay" />
          </div>
          <div>
            <Label>Location</Label>
            <TextInput value={location} onChange={(e)=>setLocation(e.target.value)} placeholder="Bangalore / Colombo / ..." />
          </div>
          <div className="md:col-span-2">
            <Label>Summary</Label>
            <TextInput value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="One-line premium summary" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <TextArea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Full description" />
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <TextInput value={tagsCsv} onChange={(e)=>setTagsCsv(e.target.value)} placeholder="infra, interiors, luxury" />
          </div>
          <div>
            <Label>Sort Order</Label>
            <TextInput type="number" value={String(sortOrder)} onChange={(e)=>setSortOrder(Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <Label>Hero Image (optional)</Label>
            <div className="space-y-3">
              <CloudinaryUploader folder={folder} onUploaded={(url)=>setHeroUrl(url)} />
              <TextInput value={heroUrl} onChange={(e)=>setHeroUrl(e.target.value)} placeholder="Or paste image URL" />
            </div>
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input id="featured" type="checkbox" checked={isFeatured} onChange={(e)=>setIsFeatured(e.target.checked)} />
            <label htmlFor="featured" className="text-sm text-neutral-700">Featured</label>
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <PrimaryButton disabled={busy} onClick={create}>{busy ? 'Saving…' : 'Create Project'}</PrimaryButton>
            <SecondaryButton type="button" onClick={()=>{ setTitle(''); setSlug(''); setSummary(''); setDescription(''); setLocation(''); setHeroUrl(''); setTagsCsv(''); setSortOrder(0); setIsFeatured(false) }}>Clear</SecondaryButton>
            {err ? <div className="text-sm text-red-700">{err}</div> : null}
          </div>
        </div>
      </AdminCard>

      <AdminCard title="All Projects" subtitle="Delete requires ADMIN role.">
        <AdminTable
          columns={["Country", "Division", "Title", "Slug", "Featured", "Actions"]}
          rows={projects.map((p)=> (
            <tr key={p.id} className="border-t border-idam-plat">
              <td className="py-3 px-2">{p.country}</td>
              <td className="py-3 px-2">{p.division?.name || '-'}</td>
              <td className="py-3 px-2 font-medium text-idam-navy">{p.title}</td>
              <td className="py-3 px-2 text-neutral-600">{p.slug}</td>
              <td className="py-3 px-2">{p.isFeatured ? 'Yes' : 'No'}</td>
              <td className="py-3 px-2 flex items-center gap-3">
                <RowActionLink href={p.country === 'INDIA' ? `/india/projects/${p.slug}` : `/srilanka/projects/${p.slug}`} label="View" />
                <DangerButton type="button" onClick={()=>del(p.id)}>Delete</DangerButton>
              </td>
            </tr>
          ))}
        />
      </AdminCard>
    </main>
  )
}

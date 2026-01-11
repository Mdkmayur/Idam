'use client'

import { useEffect, useMemo, useState } from 'react'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import { AdminCard, AdminTable } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, TextInput, DangerButton } from '@/components/FormInput'

type Project = { id: string; title: string; slug: string; country: 'INDIA' | 'SRILANKA' }
type Media = { id: string; projectId: string; type: 'IMAGE' | 'VIDEO'; url: string; caption: string | null; sortOrder: number }

export default function ProjectMediaAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [items, setItems] = useState<Media[]>([])
  const [projectId, setProjectId] = useState('')
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [msg, setMsg] = useState('')

  async function load() {
    const p = await fetch('/api/admin/projects').then(r => r.json())
    setProjects(p.map((x: any) => ({ id: x.id, title: x.title, slug: x.slug, country: x.country })))
    const m = await fetch('/api/admin/project-media').then(r => r.json())
    setItems(m)
  }

  useEffect(() => { load() }, [])

  const folder = useMemo(() => {
    const pr = projects.find(x => x.id === projectId)
    if (!pr) return 'idam/uploads'
    const c = pr.country === 'INDIA' ? 'india' : 'srilanka'
    return `idam/${c}/projects/${pr.slug}`
  }, [projects, projectId])

  const filtered = items.filter(i => !projectId || i.projectId === projectId)

  async function create() {
    setMsg('')
    const res = await fetch('/api/admin/project-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, type, url, caption, sortOrder })
    })
    if (!res.ok) { setMsg('Create failed (check login/role)'); return }
    setUrl(''); setCaption(''); setSortOrder(0)
    await load(); setMsg('Created')
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/project-media/${id}`, { method: 'DELETE' })
    if (!res.ok) { setMsg('Delete failed (ADMIN only)'); return }
    await load(); setMsg('Deleted')
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <AdminCard title="Project Gallery Media" subtitle="Upload images/videos to projects. Click reorder for drag-style ordering." right={<a className="text-idam-navy hover:underline" href="/admin/project-media/reorder">Reorder →</a>}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Project</Label>
            <Select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
              <option value="">Select a project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.country} — {p.title}</option>)}
            </Select>

            <div className="mt-4">
              <Label>Type</Label>
              <Select value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
              </Select>
            </div>

            <div className="mt-4">
              <Label>Upload to Cloudinary</Label>
              <CloudinaryUploader folder={folder} onUploaded={(u) => setUrl(u)} />
              <div className="mt-2 text-xs text-neutral-600">Folder: {folder}</div>
            </div>

            <div className="mt-4">
              <Label>URL</Label>
              <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>

            <div className="mt-4">
              <Label>Caption</Label>
              <TextInput value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Optional" />
            </div>

            <div className="mt-4">
              <Label>Sort order</Label>
              <TextInput type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value || '0'))} />
            </div>

            <div className="mt-5 flex gap-3 items-center">
              <PrimaryButton type="button" onClick={create} disabled={!projectId || !url}>Create</PrimaryButton>
              {msg ? <div className="text-sm text-neutral-600">{msg}</div> : null}
            </div>
          </div>

          <div>
            <div className="text-sm text-neutral-600">Showing {filtered.length} items</div>
            <div className="mt-4">
              <AdminTable columns={["Type", "Caption", "Sort", "Actions"]} rows={
                filtered.map(m => (
                  <tr key={m.id} className="border-t border-idam-plat">
                    <td className="py-3 px-2">{m.type}</td>
                    <td className="py-3 px-2">{m.caption || '-'}</td>
                    <td className="py-3 px-2">{m.sortOrder}</td>
                    <td className="py-3 px-2">
                      <a className="text-idam-navy hover:underline mr-3" href={m.url} target="_blank" rel="noreferrer">Open</a>
                      <DangerButton type="button" onClick={() => remove(m.id)}>Delete</DangerButton>
                    </td>
                  </tr>
                ))
              } />
            </div>
          </div>
        </div>
      </AdminCard>
    </main>
  )
}

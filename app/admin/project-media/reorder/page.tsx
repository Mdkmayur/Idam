'use client'

import { useEffect, useMemo, useState } from 'react'
import { AdminCard } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, SecondaryButton } from '@/components/FormInput'

type Project = { id: string; title: string; country: 'INDIA' | 'SRILANKA' }
type Media = { id: string; url: string; type: 'IMAGE' | 'VIDEO'; sortOrder: number; caption?: string | null }

export default function ReorderProjectMedia() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState<string>('')
  const [items, setItems] = useState<Media[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string>('')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then((r) => r.json())
      .then((x) => setProjects(x.map((p: any) => ({ id: p.id, title: p.title, country: p.country }))))
      .catch(() => {})
  }, [])

  async function load(pid: string) {
    setProjectId(pid)
    setMsg('')
    const res = await fetch('/api/admin/project-media')
    const all = await res.json()
    const filtered = (all as any[])
      .filter((m) => m.projectId === pid)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((m) => ({ id: m.id, url: m.url, type: m.type, sortOrder: m.sortOrder ?? 0, caption: m.caption }))
    setItems(filtered)
  }

  function move(from: number, to: number) {
    setItems((prev) => {
      const copy = [...prev]
      const [it] = copy.splice(from, 1)
      copy.splice(to, 0, it)
      return copy.map((x, i) => ({ ...x, sortOrder: i + 1 }))
    })
  }

  async function save() {
    if (!projectId) return
    setBusy(true)
    setMsg('')
    const payload = items.map((x, idx) => ({ id: x.id, sortOrder: idx + 1 }))
    const res = await fetch('/api/admin/project-media/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, items: payload }),
    })
    setBusy(false)
    setMsg(res.ok ? 'Saved.' : 'Failed.')
  }

  const projectOptions = useMemo(() => projects, [projects])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Reorder Project Gallery</h1>

      <div className="mt-6">
        <AdminCard
          title="Select Project"
          subtitle="Drag-like reorder with Up/Down buttons, then Save."
          right={
            <PrimaryButton disabled={!projectId || busy} onClick={save}>
              {busy ? 'Saving…' : 'Save'}
            </PrimaryButton>
          }
        >
          <div className="max-w-xl">
            <Label>Project</Label>
            <Select value={projectId} onChange={(e) => load(e.target.value)}>
              <option value="">Select a project</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.country} — {p.title}
                </option>
              ))}
            </Select>
            {msg ? <div className="mt-3 text-sm text-neutral-700">{msg}</div> : null}
          </div>

          <div className="mt-6 space-y-3">
            {items.map((m, i) => (
              <div key={m.id} className="flex items-center gap-4 rounded-2xl border border-idam-plat bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt="" className="w-20 h-16 object-cover rounded-xl border border-idam-plat" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-idam-navy">#{i + 1} · {m.type}</div>
                  <div className="text-xs text-neutral-600 line-clamp-1">{m.caption || '-'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <SecondaryButton disabled={i === 0} onClick={() => move(i, i - 1)}>↑</SecondaryButton>
                  <SecondaryButton disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>↓</SecondaryButton>
                </div>
              </div>
            ))}
            {!items.length && projectId ? <div className="text-sm text-neutral-600">No media yet for this project.</div> : null}
          </div>
        </AdminCard>
      </div>
    </main>
  )
}

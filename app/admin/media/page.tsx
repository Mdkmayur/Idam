'use client'

import { useEffect, useMemo, useState } from 'react'
import CloudinaryUploader from '@/components/CloudinaryUploader'
import { AdminCard, AdminTable } from '@/components/AdminTable'
import { Label, PrimaryButton, Select, TextInput, DangerButton } from '@/components/FormInput'

type Album = { id: string; title: string; country: 'INDIA' | 'SRILANKA' }
type Media = { id: string; albumId: string; type: 'IMAGE' | 'VIDEO'; url: string; caption?: string | null; sortOrder: number }

export default function AdminAlbumMedia() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [rows, setRows] = useState<Media[]>([])
  const [albumId, setAlbumId] = useState('')
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>('IMAGE')
  const [url, setUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [busy, setBusy] = useState(false)

  async function load() {
    const [albumsRes, mediaRes] = await Promise.all([
      fetch('/api/admin/albums'),
      fetch('/api/admin/media'),
    ])
    setAlbums(await albumsRes.json())
    setRows(await mediaRes.json())
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => (albumId ? rows.filter((r) => r.albumId === albumId) : rows), [rows, albumId])

  async function create() {
    if (!albumId || !url) return
    setBusy(true)
    await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId, type, url, caption, sortOrder: Number(sortOrder) }),
    })
    setBusy(false)
    setUrl(''); setCaption(''); setSortOrder(0)
    await load()
  }

  async function del(id: string) {
    if (!confirm('Delete this media?')) return
    await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    await load()
  }

  const folder = useMemo(() => {
    const a = albums.find((x) => x.id === albumId)
    if (!a) return 'idam/albums'
    const country = a.country === 'INDIA' ? 'india' : 'srilanka'
    return `idam/${country}/albums/${a.id}`
  }, [albumId, albums])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Album Media</h1>

      <div className="mt-8 grid gap-6">
        <AdminCard title="Add media" subtitle="Upload images/videos into albums (Cloudinary).">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Album</Label>
              <Select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
                <option value="">Select album</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.country} — {a.title}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={type} onChange={(e) => setType(e.target.value as any)}>
                <option value="IMAGE">IMAGE</option>
                <option value="VIDEO">VIDEO</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Cloudinary upload</Label>
              <CloudinaryUploader folder={folder} onUploaded={setUrl} />
            </div>
            <div className="md:col-span-2">
              <Label>Media URL</Label>
              <TextInput value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Caption (optional)</Label>
              <TextInput value={caption} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div>
              <Label>Sort order</Label>
              <TextInput type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
          <div className="mt-5">
            <PrimaryButton disabled={busy || !albumId || !url} onClick={create}>
              {busy ? 'Saving…' : 'Save media'}
            </PrimaryButton>
          </div>
        </AdminCard>

        <AdminCard title="Existing media" subtitle="Filter by album to manage.">
          <div className="mb-4">
            <Label>Filter album</Label>
            <Select value={albumId} onChange={(e) => setAlbumId(e.target.value)}>
              <option value="">All albums</option>
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.country} — {a.title}
                </option>
              ))}
            </Select>
          </div>

          <AdminTable
            columns={['Type', 'Preview', 'Caption', 'Sort', 'Actions']}
            rows={filtered.map((m) => (
              <tr key={m.id} className="border-t border-idam-plat">
                <td className="py-3 px-2">{m.type}</td>
                <td className="py-3 px-2">
                  {m.type === 'IMAGE' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt="" className="h-12 w-16 object-cover rounded-xl border border-idam-plat" />
                  ) : (
                    <a className="text-idam-navy hover:underline" href={m.url} target="_blank" rel="noreferrer">
                      Video
                    </a>
                  )}
                </td>
                <td className="py-3 px-2 text-neutral-600">{m.caption || '-'}</td>
                <td className="py-3 px-2">{m.sortOrder}</td>
                <td className="py-3 px-2">
                  <DangerButton onClick={() => del(m.id)}>Delete</DangerButton>
                </td>
              </tr>
            ))}
          />
        </AdminCard>
      </div>
    </main>
  )
}

'use client'

import { useState } from 'react'
import { PrimaryButton } from '@/components/FormInput'

export default function CloudinaryUploader({
  folder,
  onUploaded,
}: {
  folder: string
  onUploaded: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string>('')

  async function upload(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      setErr('Cloudinary env vars missing. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.')
      return
    }

    setBusy(true)
    setErr('')

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)
    form.append('folder', folder)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: form,
    })

    const data = await res.json()
    setBusy(false)

    if (!res.ok) {
      setErr(data?.error?.message || 'Upload failed')
      return
    }

    onUploaded(data.secure_url)
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) upload(f)
        }}
        className="text-sm"
      />
      <PrimaryButton type="button" disabled={busy} onClick={() => {}}>
        {busy ? 'Uploading…' : 'Upload'}
      </PrimaryButton>
      {err ? <div className="text-xs text-red-700">{err}</div> : null}
    </div>
  )
}

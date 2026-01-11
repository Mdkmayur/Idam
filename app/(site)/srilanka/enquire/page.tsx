'use client'

import { useState } from 'react'
import { Label, PrimaryButton, TextArea, TextInput } from '@/components/FormInput'

export default function SriLankaEnquire() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [division, setDivision] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState('')
  const [err, setErr] = useState('')

  async function submit() {
    setBusy(true)
    setOk('')
    setErr('')
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'SRILANKA', name, email, phone, division, message }),
    })
    setBusy(false)
    if (!res.ok) {
      setErr('Failed to submit. Please check inputs.')
      return
    }
    setOk('Thanks. We will contact you shortly.')
    setName('')
    setEmail('')
    setPhone('')
    setDivision('')
    setMessage('')
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">SRI LANKA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Enquire</h1>
      <p className="mt-2 text-neutral-600">Share your requirement. Our team will respond with next steps.</p>

      <div className="mt-8 rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>NAME</Label>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label>EMAIL</Label>
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <Label>PHONE</Label>
            <TextInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <Label>DIVISION</Label>
            <TextInput value={division} onChange={(e) => setDivision(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div className="mt-4">
          <Label>MESSAGE</Label>
          <TextArea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <PrimaryButton type="button" disabled={busy} onClick={submit}>
            {busy ? 'Submitting…' : 'Submit'}
          </PrimaryButton>
          {ok ? <div className="text-sm text-green-700">{ok}</div> : null}
          {err ? <div className="text-sm text-red-700">{err}</div> : null}
        </div>
      </div>
    </main>
  )
}

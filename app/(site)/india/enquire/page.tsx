'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function IndiaEnquirePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [division, setDivision] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setBusy(true)
    setOk(false)
    setErr('')

    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'INDIA', name, email, phone, division, message }),
    })

    setBusy(false)

    if (!res.ok) {
      setErr('Could not submit. Please check details and try again.')
      return
    }

    setOk(true)
    setName('')
    setEmail('')
    setPhone('')
    setDivision('')
    setMessage('')
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs tracking-[0.35em] text-idam-gold">INDIA</div>
      <h1 className="mt-2 text-3xl font-semibold text-idam-navy">Enquire</h1>
      <p className="mt-2 text-neutral-600">Tell us what you need — we will respond with a proposal.</p>

      <div className="mt-8 rounded-3xl border border-idam-plat bg-white p-6 shadow-soft">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-idam-navy">Name</label>
            <input
              className="mt-2 w-full rounded-2xl border border-idam-plat px-4 py-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-idam-navy">Email</label>
            <input
              className="mt-2 w-full rounded-2xl border border-idam-plat px-4 py-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-idam-navy">Phone</label>
            <input
              className="mt-2 w-full rounded-2xl border border-idam-plat px-4 py-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-idam-navy">Division</label>
            <input
              className="mt-2 w-full rounded-2xl border border-idam-plat px-4 py-3"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-idam-navy">Message</label>
          <textarea
            className="mt-2 w-full min-h-[140px] rounded-2xl border border-idam-plat px-4 py-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you want to build, timeline, budget range, and any requirements."
          />
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="rounded-2xl bg-idam-navy text-white px-5 py-3 disabled:opacity-60"
          >
            {busy ? 'Submitting…' : 'Submit'}
          </button>

          {ok ? <div className="text-sm text-green-700">Submitted. We will contact you soon.</div> : null}
          {err ? <div className="text-sm text-red-700">{err}</div> : null}
        </div>

        <div className="mt-6">
          <Link href="/india" className="text-sm text-idam-navy hover:underline">
            ← Back to India
          </Link>
        </div>
      </div>
    </main>
  )
}

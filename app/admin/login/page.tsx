'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Label, PrimaryButton, TextInput } from '@/components/FormInput'

export default function AdminLogin() {
  const [email, setEmail] = useState('Mayurdkumar@gmail.com')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit() {
    setBusy(true)
    setErr('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: true,
      callbackUrl: '/admin',
    })
    // NextAuth will redirect; if it doesn't, show error
    setBusy(false)
    if ((res as any)?.error) setErr('Invalid credentials')
  }

  return (
    <main className="min-h-screen bg-idam-navy text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 shadow-soft">
        <div className="text-xs tracking-[0.35em] text-idam-gold">IDAM ADMIN</div>
        <h1 className="mt-3 text-2xl font-semibold">Sign in</h1>

        <div className="mt-6">
          <Label>Email</Label>
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-4">
          <Label>Password</Label>
          <TextInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {err ? <div className="mt-4 text-sm text-red-200">{err}</div> : null}

        <div className="mt-6">
          <PrimaryButton type="button" disabled={busy} onClick={submit} className="w-full">
            {busy ? 'Signing in…' : 'Login'}
          </PrimaryButton>
        </div>

        <div className="mt-6 text-xs text-white/70">
          Tip: Run the seed step with ADMIN_PASSWORD to create your admin login.
        </div>
      </div>
    </main>
  )
}

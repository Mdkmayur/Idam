'use client'

import React from 'react'

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs tracking-[0.25em] text-idam-gold mb-2">{children}</div>
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-2xl border border-idam-plat bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-idam-gold/30 ' +
        (props.className || '')
      }
    />
  )
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        'w-full min-h-[120px] rounded-2xl border border-idam-plat bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-idam-gold/30 ' +
        (props.className || '')
      }
    />
  )
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        'w-full rounded-2xl border border-idam-plat bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-idam-gold/30 ' +
        (props.className || '')
      }
    />
  )
}

export function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'rounded-2xl bg-idam-navy text-white px-5 py-3 font-medium hover:opacity-95 disabled:opacity-50 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'rounded-2xl border border-idam-plat bg-white px-5 py-3 font-medium text-idam-navy hover:bg-idam-plat/40 disabled:opacity-50 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'rounded-2xl border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 ' +
        (props.className || '')
      }
    >
      {children}
    </button>
  )
}

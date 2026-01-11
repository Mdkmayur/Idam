import React from 'react'
import Link from 'next/link'

export function AdminCard({
  title,
  subtitle,
  right,
  children,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-idam-plat bg-white shadow-soft overflow-hidden">
      <div className="p-6 border-b border-idam-plat flex items-end justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-idam-navy">{title}</div>
          {subtitle ? <div className="text-sm text-neutral-600 mt-1">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function AdminTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: React.ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-neutral-600">
          <tr>
            {columns.map((c) => (
              <th key={c} className="py-2 px-2">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

export function RowActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-idam-navy hover:underline font-medium">
      {label}
    </Link>
  )
}

'use client'

import { useEffect } from 'react'

export default function ProjectViewTracker({
  projectId,
  country,
}: {
  projectId: string
  country: 'INDIA' | 'SRILANKA'
}) {
  useEffect(() => {
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, country }),
    }).catch(() => {})
  }, [projectId, country])

  return null
}

'use client'

import { useMemo, useRef, useState } from 'react'
import Lightbox, { LightboxItem } from '@/components/Lightbox'

export default function ProjectGalleryGrid({
  items,
  variant = 'compact',
}: {
  items: LightboxItem[]
  variant?: 'compact' | 'full'
}) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

  const safeItems = useMemo(() => items || [], [items])

  function openAt(i: number) {
    setIndex(i)
    setOpen(true)
  }

  function close() {
    setOpen(false)
  }

  function prev() {
    setIndex((i) => (i - 1 + safeItems.length) % safeItems.length)
  }

  function next() {
    setIndex((i) => (i + 1) % safeItems.length)
  }

  function playPreview(id: string) {
    const v = videoRefs.current[id]
    if (!v) return
    v.muted = true
    v.playsInline = true
    v.loop = true
    const p = v.play()
    if (p && typeof (p as any).catch === 'function') (p as any).catch(() => {})
  }

  function pausePreview(id: string) {
    const v = videoRefs.current[id]
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  if (!safeItems.length) return null

  return (
    <>
      <div className={variant === 'full' ? 'grid sm:grid-cols-2 md:grid-cols-3 gap-4' : 'grid sm:grid-cols-2 md:grid-cols-3 gap-4'}>
        {safeItems.map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => openAt(i)}
            onMouseEnter={() => (m.type === 'VIDEO' ? playPreview(m.id) : null)}
            onMouseLeave={() => (m.type === 'VIDEO' ? pausePreview(m.id) : null)}
            onFocus={() => (m.type === 'VIDEO' ? playPreview(m.id) : null)}
            onBlur={() => (m.type === 'VIDEO' ? pausePreview(m.id) : null)}
            className="rounded-2xl border border-idam-plat bg-white overflow-hidden shadow-soft hover:shadow-md transition text-left"
          >
            <div className="aspect-[4/3] bg-idam-plat">
              {m.type === 'IMAGE' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.caption || 'media'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full relative">
                  <video
                    ref={(el) => {
                      videoRefs.current[m.id] = el
                    }}
                    src={m.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 grid place-items-center pointer-events-none">
                    <div className="rounded-full bg-black/55 text-white px-4 py-2 text-xs border border-white/15">
                      Hover to preview
                    </div>
                  </div>
                </div>
              )}
            </div>

            {m.caption ? <div className="p-4 text-sm text-neutral-600 line-clamp-2">{m.caption}</div> : null}
          </button>
        ))}
      </div>

      <Lightbox open={open} index={index} items={safeItems} onClose={close} onPrev={prev} onNext={next} />
    </>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export type LightboxItem = {
  id: string
  type: 'IMAGE' | 'VIDEO'
  url: string
  caption?: string | null
}

function dist(a: Touch, b: Touch) {
  const dx = a.clientX - b.clientX
  const dy = a.clientY - b.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

export default function Lightbox({
  open,
  index,
  items,
  onClose,
  onPrev,
  onNext,
}: {
  open: boolean
  index: number
  items: LightboxItem[]
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = items[index]

  // Swipe
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const [swipeHint, setSwipeHint] = useState<'idle' | 'left' | 'right'>('idle')

  // Zoom/pan for images
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const pinchStartDist = useRef<number | null>(null)
  const pinchStartScale = useRef<number>(1)
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)

  const isImage = item?.type === 'IMAGE'
  const maxScale = 4

  const resetView = () => {
    setScale(1)
    setTx(0)
    setTy(0)
  }

  useEffect(() => {
    if (!open) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
      if (e.key.toLowerCase() === 'r') resetView()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose, onPrev, onNext])

  useEffect(() => {
    if (!open) return
    setSwipeHint('idle')
    startX.current = null
    startY.current = null
    pinchStartDist.current = null
    pinchStartScale.current = 1
    panStart.current = null
    resetView()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index])

  const canSwipe = useMemo(() => scale <= 1.02, [scale])

  if (!open || !item) return null

  function onTouchStart(e: React.TouchEvent) {
    setSwipeHint('idle')

    if (isImage && e.touches.length === 2) {
      pinchStartDist.current = dist(e.touches[0], e.touches[1])
      pinchStartScale.current = scale
      return
    }

    const t = e.touches[0]
    startX.current = t.clientX
    startY.current = t.clientY

    if (isImage && scale > 1.02) {
      panStart.current = { x: t.clientX, y: t.clientY, tx, ty }
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (isImage && e.touches.length === 2) {
      const d = dist(e.touches[0], e.touches[1])
      if (!pinchStartDist.current) {
        pinchStartDist.current = d
        pinchStartScale.current = scale
        return
      }
      const ratio = d / pinchStartDist.current
      const nextScale = Math.max(1, Math.min(maxScale, pinchStartScale.current * ratio))
      setScale(nextScale)
      return
    }

    const t = e.touches[0]

    if (isImage && scale > 1.02 && panStart.current) {
      const dx = t.clientX - panStart.current.x
      const dy = t.clientY - panStart.current.y
      setTx(panStart.current.tx + dx)
      setTy(panStart.current.ty + dy)
      return
    }

    if (!canSwipe) return
    if (startX.current == null || startY.current == null) return

    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current

    if (Math.abs(dy) > Math.abs(dx)) return

    if (dx < -30) setSwipeHint('left')
    else if (dx > 30) setSwipeHint('right')
    else setSwipeHint('idle')
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (isImage && pinchStartDist.current) {
      pinchStartDist.current = null
      pinchStartScale.current = scale
    }
    panStart.current = null

    if (!canSwipe) {
      setSwipeHint('idle')
      startX.current = null
      startY.current = null
      return
    }

    if (startX.current == null || startY.current == null) return

    const t = e.changedTouches[0]
    const dx = t.clientX - startX.current
    const dy = t.clientY - startY.current

    startX.current = null
    startY.current = null

    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) {
      setSwipeHint('idle')
      return
    }

    if (dx < 0) onNext()
    else onPrev()

    setSwipeHint('idle')
  }

  function onWheel(e: React.WheelEvent) {
    if (!isImage) return
    e.preventDefault()
    const delta = -e.deltaY
    const step = delta > 0 ? 0.15 : -0.15
    setScale((s) => Math.max(1, Math.min(maxScale, s + step)))
  }

  function zoomIn() {
    if (!isImage) return
    setScale((s) => Math.max(1, Math.min(maxScale, s + 0.25)))
  }

  function zoomOut() {
    if (!isImage) return
    setScale((s) => Math.max(1, Math.min(maxScale, s - 0.25)))
    setTimeout(() => {
      setScale((s) => {
        if (s <= 1.02) {
          setTx(0)
          setTy(0)
          return 1
        }
        return s
      })
    }, 0)
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button type="button" className="absolute inset-0 bg-black/70" onClick={onClose} aria-label="Close lightbox" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-xs tracking-[0.35em] text-idam-gold">GALLERY</div>
              <div className="text-sm text-white/80 truncate">{item.caption || `${index + 1} of ${items.length}`}</div>
            </div>

            <div className="flex items-center gap-2">
              {isImage ? (
                <>
                  <button type="button" onClick={zoomOut} className="rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-2 hover:bg-idam-navy/80">−</button>
                  <button type="button" onClick={zoomIn} className="rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-2 hover:bg-idam-navy/80">+</button>
                  <button type="button" onClick={resetView} className="rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-2 hover:bg-idam-navy/80" title="Reset (R)">Reset</button>
                </>
              ) : null}

              <button type="button" onClick={onClose} className="rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-2 hover:bg-idam-navy/80">Close</button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 overflow-hidden shadow-soft" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} onWheel={onWheel}>
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent pointer-events-none" />

              {swipeHint !== 'idle' && canSwipe ? (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="rounded-full bg-black/55 text-white px-5 py-3 text-xs border border-white/15">
                    {swipeHint === 'left' ? 'Next →' : '← Previous'}
                  </div>
                </div>
              ) : null}

              <div className="bg-black">
                {item.type === 'IMAGE' ? (
                  <div className="w-full max-h-[78vh] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.caption || 'gallery image'}
                      className="max-h-[78vh] select-none"
                      draggable={false}
                      style={{
                        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
                        transformOrigin: 'center center',
                        transition: pinchStartDist.current ? 'none' : 'transform 80ms linear',
                      }}
                    />
                  </div>
                ) : (
                  <video src={item.url} controls className="w-full max-h-[78vh] object-contain" />
                )}
              </div>

              <button type="button" onClick={onPrev} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-3 hover:bg-idam-navy/80" aria-label="Previous">←</button>
              <button type="button" onClick={onNext} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-idam-navy/60 text-white px-4 py-3 hover:bg-idam-navy/80" aria-label="Next">→</button>
            </div>

            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="text-xs text-white/70">{index + 1} / {items.length}</div>
              <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-idam-gold hover:underline">Open original</a>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/60 text-center">
            Mobile: swipe ← → · pinch to zoom · drag to pan · Desktop: wheel zoom · ← → keys · Esc to close · R reset
          </div>
        </div>
      </div>
    </div>
  )
}

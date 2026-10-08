'use client'

import { useRef, useEffect, useState } from 'react'
import LogoLauris from './LogoLauris'
import LogoRisoul from './LogoRisoul'
import LogoAvignon from './LogoAvignon'

const LOGOS = [
  { id: 'lauris',  Component: LogoLauris,  label: 'Lauris'  },
  { id: 'risoul',  Component: LogoRisoul,  label: 'Risoul'  },
  { id: 'avignon', Component: LogoAvignon, label: 'Avignon' },
]
const N = LOGOS.length
const AUTO_DELAY = 6500

const MASK     = 'radial-gradient(ellipse 94% 90% at 50% 50%, black 22%, transparent 100%)'
const GLW_IDLE = 'drop-shadow(0 2px 22px rgba(155,115,28,.34))'
const GLW_HOV  = 'drop-shadow(0 0 52px rgba(222,178,55,.92)) drop-shadow(0 10px 82px rgba(152,112,22,.58))'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export default function HeroLogos() {
  const [front, setFront]       = useState(0)
  const [flipKey, setFlipKey]   = useState(0)
  const [hovering, setHovering] = useState(false)

  const parallaxRef = useRef<HTMLDivElement | null>(null)
  const bookRef     = useRef<HTMLDivElement | null>(null)
  const specRef     = useRef<HTMLDivElement | null>(null)
  const pageRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null])

  const frontRef = useRef(0)
  const busyRef  = useRef(false)
  const hovRef   = useRef(false)
  const dragRef  = useRef({ on: false, x0: 0, x1: 0 })
  const mouseRef = useRef({ x: 0, y: 0 })    // raw mouse -0.5..0.5
  const pxRef    = useRef({ x: 0, y: 0 })    // lerped parallax

  // Lerped transform state (all interpolated each frame)
  const rxRef  = useRef(0)   // current rotateX
  const ryRef  = useRef(0)   // current rotateY
  const scRef  = useRef(1)   // current scale
  const tzRef  = useRef(0)   // current translateZ

  // Targets driven by hover / idle breathing
  const tRxRef = useRef(0)
  const tRyRef = useRef(0)
  const tScRef = useRef(1)
  const tTzRef = useRef(0)

  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const flipRef = useRef<(dir: 1 | -1) => void>(() => {})

  useEffect(() => {
    // ── Stack reset ────────────────────────────────────────────
    const applyStack = (f: number) => {
      LOGOS.forEach((_, i) => {
        const el = pageRefs.current[i]
        if (!el) return
        const p = ((i - f) + N) % N
        el.style.opacity       = p === 0 ? '1' : '0'
        el.style.zIndex        = String(N - p)
        el.style.filter        = p === 0 ? GLW_IDLE : 'none'
        el.style.transition    = p === 0 ? 'filter .35s ease' : 'opacity .4s ease'
        el.style.pointerEvents = p === 0 ? 'auto' : 'none'
        el.style.transform     = 'none'
      })
      // Reset lerp state
      rxRef.current = 0; ryRef.current = 0
      scRef.current = 1; tzRef.current = 0
      tRxRef.current = 0; tRyRef.current = 0
      tScRef.current = hovRef.current ? 1.06 : 1
      tTzRef.current = hovRef.current ? 16 : 0
    }

    const scheduleAuto = () => {
      if (autoRef.current) clearTimeout(autoRef.current)
      autoRef.current = setTimeout(() => flipTo(1), AUTO_DELAY)
    }

    const flipTo = (dir: 1 | -1) => {
      if (busyRef.current) return
      const cur = frontRef.current
      const nxt = (cur + dir + N) % N
      busyRef.current = true

      // Freeze tilt targets at 0 for duration of flip
      tRxRef.current = 0; tRyRef.current = 0

      const cEl = pageRefs.current[cur]
      const nEl = pageRefs.current[nxt]

      // ── Phase 1: collapse current (fast) ─────────────────────
      if (cEl) {
        cEl.style.transition = 'transform .30s cubic-bezier(.62,.04,.98,.34), opacity .18s ease, filter .18s ease'
        cEl.style.transform  = `perspective(1100px) rotateY(${dir > 0 ? -94 : 94}deg) scale(.78)`
        cEl.style.opacity    = '0'
        cEl.style.filter     = 'blur(4px)'
      }

      setTimeout(() => {
        if (cEl) {
          cEl.style.filter        = 'none'
          cEl.style.pointerEvents = 'none'
        }

        // ── Phase 2: reveal next (spring) ──────────────────────
        if (nEl) {
          nEl.style.transition    = 'none'
          nEl.style.transform     = `perspective(1100px) rotateY(${dir > 0 ? 88 : -88}deg) scale(.78)`
          nEl.style.opacity       = '0.03'
          nEl.style.filter        = 'blur(5px) ' + (hovRef.current ? GLW_HOV : GLW_IDLE)
          nEl.style.zIndex        = String(N + 1)
          nEl.style.pointerEvents = 'auto'

          requestAnimationFrame(() => requestAnimationFrame(() => {
            nEl.style.transition = [
              'transform .60s cubic-bezier(.20,.82,0,1.26)',
              'opacity .40s ease',
              'filter .32s ease',
            ].join(', ')
            nEl.style.transform = 'perspective(1100px) scale(1) rotateY(0deg)'
            nEl.style.opacity   = '1'
            nEl.style.filter    = hovRef.current ? GLW_HOV : GLW_IDLE
          }))
        }

        frontRef.current = nxt
        setFront(nxt)
        setFlipKey(k => k + 1)

        // After spring completes, restore stack & re-enable RAF
        setTimeout(() => {
          applyStack(nxt)
          if (hovRef.current) {
            const el = pageRefs.current[nxt]
            if (el) el.style.filter = GLW_HOV
          }
          busyRef.current = false
          if (!hovRef.current) scheduleAuto()
        }, 650)
      }, 315)
    }

    flipRef.current = flipTo
    applyStack(0)
    scheduleAuto()

    // ── Mouse: parallax + specular + tilt target ──────────────
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth - .5, y: e.clientY / window.innerHeight - .5 }

      if (dragRef.current.on) {
        dragRef.current.x1 = e.clientX
        if (!busyRef.current) {
          const el = pageRefs.current[frontRef.current]
          const dx = e.clientX - dragRef.current.x0
          if (el) {
            el.style.transition = 'none'
            el.style.transform  = `perspective(1100px) rotateY(${dx * .28}deg) scale(1.04) translateZ(14px)`
          }
        }
        return
      }

      if (!hovRef.current || busyRef.current) return

      const r = bookRef.current?.getBoundingClientRect()
      if (!r) return
      const nx = (e.clientX - r.left) / r.width
      const ny = (e.clientY - r.top)  / r.height

      // Specular radial highlight follows cursor
      if (specRef.current) {
        specRef.current.style.background =
          `radial-gradient(circle 62% at ${nx * 100}% ${ny * 100}%, rgba(255,248,218,.16) 0%, rgba(255,225,140,.06) 42%, transparent 70%)`
      }

      // Tilt targets from cursor position
      tRxRef.current = (ny - .5) * -25
      tRyRef.current = (nx - .5) *  28
    }

    const onUp = () => {
      if (!dragRef.current.on) return
      dragRef.current.on = false
      const dx = dragRef.current.x1 - dragRef.current.x0
      if      (dx < -55) flipTo(1)
      else if (dx >  55) flipTo(-1)
      else {
        const el = pageRefs.current[frontRef.current]
        if (el) {
          el.style.transition = 'transform .50s cubic-bezier(.25,.46,.45,.94)'
          el.style.transform  = 'perspective(1100px) scale(1)'
        }
      }
    }

    // ── Touch ─────────────────────────────────────────────────
    const onTouchStart = (e: TouchEvent) => {
      if (busyRef.current) return
      dragRef.current = { on: true, x0: e.touches[0].clientX, x1: e.touches[0].clientX }
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.on) return
      dragRef.current.x1 = e.touches[0].clientX
      const dx = dragRef.current.x1 - dragRef.current.x0
      const el = pageRefs.current[frontRef.current]
      if (el && !busyRef.current) {
        el.style.transition = 'none'
        el.style.transform  = `perspective(1100px) rotateY(${dx * .24}deg) scale(1.02)`
      }
    }
    const onTouchEnd = () => {
      if (!dragRef.current.on) return
      dragRef.current.on = false
      const dx = dragRef.current.x1 - dragRef.current.x0
      if      (dx < -46) flipTo(1)
      else if (dx >  46) flipTo(-1)
      else {
        const el = pageRefs.current[frontRef.current]
        if (el) { el.style.transition = 'transform .45s ease-out'; el.style.transform = 'none' }
      }
    }

    // ── Keyboard ──────────────────────────────────────────────
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') flipTo(1)
      else if (e.key === 'ArrowLeft') flipTo(-1)
    }

    // ── RAF: lerped parallax + tilt ───────────────────────────
    let raf: number
    const tick = () => {
      // Smooth parallax (camera pan)
      pxRef.current.x = lerp(pxRef.current.x, mouseRef.current.x * -38, .055)
      pxRef.current.y = lerp(pxRef.current.y, mouseRef.current.y * 23,  .055)
      if (parallaxRef.current)
        parallaxRef.current.style.transform =
          `translate(${pxRef.current.x.toFixed(2)}px,${pxRef.current.y.toFixed(2)}px)`

      const el = pageRefs.current[frontRef.current]
      if (!el || dragRef.current.on || busyRef.current) {
        raf = requestAnimationFrame(tick)
        return
      }

      // ── Update targets ──────────────────────────────────────
      if (hovRef.current) {
        // Targets already set by onMove
        tScRef.current = 1.06
        tTzRef.current = 16
      } else {
        // Layered idle breathing: two sine waves per axis for organic feel
        const t  = Date.now() * .001
        tRxRef.current = Math.cos(t * .29) * 2.4 + Math.sin(t * .63) * .85
        tRyRef.current = Math.sin(t * .43) * 5.8 + Math.cos(t * .19) * 1.5
        tScRef.current = 1 + Math.sin(t * .22) * .004   // very subtle scale breathe
        tTzRef.current = 0
      }

      // ── Lerp all 4 values ───────────────────────────────────
      const spd = hovRef.current ? .10 : .05   // faster response on hover
      rxRef.current = lerp(rxRef.current, tRxRef.current, spd)
      ryRef.current = lerp(ryRef.current, tRyRef.current, spd)
      scRef.current = lerp(scRef.current, tScRef.current, .08)
      tzRef.current = lerp(tzRef.current, tTzRef.current, .08)

      // Set transition only for filter (transform is instant via RAF)
      if (el.style.transition !== 'filter .35s ease')
        el.style.transition = 'filter .35s ease'

      el.style.transform =
        `perspective(1100px)` +
        ` rotateX(${rxRef.current.toFixed(3)}deg)` +
        ` rotateY(${ryRef.current.toFixed(3)}deg)` +
        ` scale(${scRef.current.toFixed(4)})` +
        ` translateZ(${tzRef.current.toFixed(2)}px)`

      raf = requestAnimationFrame(tick)
    }

    const book = bookRef.current
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseup',   onUp)
    window.addEventListener('keydown',   onKey)
    book?.addEventListener('touchstart',  onTouchStart, { passive: true })
    book?.addEventListener('touchmove',   onTouchMove,  { passive: true })
    book?.addEventListener('touchend',    onTouchEnd)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      window.removeEventListener('keydown',   onKey)
      book?.removeEventListener('touchstart',  onTouchStart)
      book?.removeEventListener('touchmove',   onTouchMove)
      book?.removeEventListener('touchend',    onTouchEnd)
      cancelAnimationFrame(raf)
      if (autoRef.current) clearTimeout(autoRef.current)
    }
  }, [])

  // ── React hover handlers ──────────────────────────────────
  const onHoverEnter = () => {
    hovRef.current = true
    setHovering(true)
    if (autoRef.current) { clearTimeout(autoRef.current); autoRef.current = null }
    const el = pageRefs.current[frontRef.current]
    if (el) el.style.filter = GLW_HOV
    if (specRef.current) specRef.current.style.opacity = '1'
  }
  const onHoverLeave = () => {
    hovRef.current = false
    setHovering(false)
    tRxRef.current = 0; tRyRef.current = 0
    tScRef.current = 1; tTzRef.current = 0
    const el = pageRefs.current[frontRef.current]
    if (el) el.style.filter = GLW_IDLE
    if (specRef.current) specRef.current.style.opacity = '0'
    if (autoRef.current) clearTimeout(autoRef.current)
    autoRef.current = setTimeout(() => flipRef.current(1), AUTO_DELAY)
  }

  return (
    <>
      <style>{`
        @keyframes hl-bar { from { width: 0% } to { width: 100% } }
      `}</style>

      <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden" aria-hidden="true">
        <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>

          {/* ── Coin container ──────────────────────────────── */}
          <div
            ref={bookRef}
            tabIndex={0}
            style={{
              position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)',
              width: '42%', aspectRatio: '560/340', pointerEvents: 'auto',
              cursor: 'grab', outline: 'none',
            }}
            onMouseEnter={onHoverEnter}
            onMouseLeave={onHoverLeave}
            onMouseDown={e => {
              if (busyRef.current) return
              dragRef.current = { on: true, x0: e.clientX, x1: e.clientX }
              e.currentTarget.style.cursor = 'grabbing'
              e.preventDefault()
            }}
            onMouseUp={e => { e.currentTarget.style.cursor = 'grab' }}
            onClick={e => {
              if (Math.abs(dragRef.current.x1 - dragRef.current.x0) < 8) flipRef.current(1)
              e.stopPropagation()
            }}
          >
            {LOGOS.map(({ id, Component }, i) => (
              <div key={id} ref={el => { pageRefs.current[i] = el }}
                style={{
                  position: 'absolute', inset: 0,
                  maskImage: MASK, WebkitMaskImage: MASK,
                  willChange: 'transform, opacity, filter',
                }}>
                <Component />
              </div>
            ))}

            {/* Specular highlight — radial gradient chasing the cursor */}
            <div ref={specRef} style={{
              position: 'absolute', inset: 0, opacity: 0,
              transition: 'opacity .50s ease',
              pointerEvents: 'none', zIndex: 20,
              maskImage: MASK, WebkitMaskImage: MASK,
            }} />
          </div>

          {/* ── Navigation indicators ───────────────────────── */}
          <div style={{
            position: 'absolute', right: '2%', width: '42%',
            top: 'calc(50% + 21vw * 340/560 + 8px)',
            display: 'flex', justifyContent: 'center', gap: '6px',
            alignItems: 'center', pointerEvents: 'auto',
          }}>
            {LOGOS.map(({ label }, i) => {
              const active = i === front
              return (
                <button key={i}
                  onClick={() => {
                    if (i === frontRef.current || busyRef.current) return
                    const fwd  = (i - frontRef.current + N) % N
                    const back = (frontRef.current - i + N) % N
                    flipRef.current(fwd <= back ? 1 : -1)
                  }}
                  style={{
                    position: 'relative', overflow: 'hidden',
                    padding: '4px 12px', borderRadius: '99px', border: 'none',
                    background: active ? 'rgba(215,168,50,.76)' : 'rgba(215,168,50,.18)',
                    color:      active ? 'rgba(255,238,185,.96)' : 'rgba(235,218,185,.40)',
                    fontSize: '9px', fontFamily: 'var(--font-cinzel,Georgia,serif)',
                    letterSpacing: '.18em', fontWeight: 600, cursor: 'pointer',
                    transition: 'background .38s ease, color .38s ease',
                    whiteSpace: 'nowrap',
                  }}>
                  {label.toUpperCase()}
                  {active && (
                    <span key={flipKey} style={{
                      position: 'absolute', bottom: 0, left: 0, height: '2px',
                      background: 'rgba(255,225,118,.92)',
                      animation: `hl-bar ${AUTO_DELAY}ms linear forwards`,
                      animationPlayState: hovering ? 'paused' : 'running',
                      width: '0%',
                    }} />
                  )}
                </button>
              )
            })}
          </div>

        </div>
      </div>
    </>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { COUNTRIES } from '@/lib/locale'

export function LocaleSelector() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const currentCountry = useStore(s => s.currentCountry)
  const setCountry = useStore(s => s.setCountry)
  const cfg = COUNTRIES[currentCountry] ?? COUNTRIES.TR

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-ghost flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"
      >
        <span>{cfg.flag}</span>
        <span className="hidden sm:inline">{cfg.name}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-3xl border border-white/10 bg-[#110b05] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden max-h-[420px] overflow-y-auto">
          {Object.entries(COUNTRIES).map(([code, c]) => (
            <button
              key={code}
              onClick={() => { setCountry(code); setOpen(false) }}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/5 ${
                code === currentCountry ? 'bg-white/5 text-[#ff9a3c]' : 'text-[#fff8f4]'
              }`}
            >
              <span className="text-xl">{c.flag}</span>
              <span className="flex-1 font-semibold">{c.name}</span>
              <span className="text-xs text-[#c4a896] bg-white/5 px-2 py-0.5 rounded-full">{c.currency}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

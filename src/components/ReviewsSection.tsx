'use client'

import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function ReviewsSection() {
  const country = useStore(s => s.currentCountry)

  const reviews = [
    { textKey: 'rev1_text' as const, authorKey: 'rev1_author' as const },
    { textKey: 'rev2_text' as const, authorKey: 'rev2_author' as const },
    { textKey: 'rev3_text' as const, authorKey: 'rev3_author' as const },
  ]

  return (
    <section className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">
          {t(country, 'rev_eyebrow')}
        </span>
        <h2 className="text-4xl font-black">{t(country, 'rev_h2')}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <article key={i} className="rounded-[1.75rem] border border-[rgba(255,154,60,0.1)] bg-white/[0.04] p-7">
            <p className="text-amber-400 text-lg mb-3">★★★★★</p>
            <p className="text-[#fff8f4] leading-relaxed italic mb-4 text-sm">{t(country, r.textKey)}</p>
            <span className="text-[#ff9a3c] font-bold text-sm">{t(country, r.authorKey)}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'
import type { FeaturedReview } from '@/lib/db-reviews'

export function ReviewsSection({ reviews }: { reviews: FeaturedReview[] }) {
  const country = useStore(s => s.currentCountry)

  if (reviews.length === 0) return null

  return (
    <section className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">
          {t(country, 'rev_eyebrow')}
        </span>
        <h2 className="text-4xl font-black">{t(country, 'rev_h2')}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {reviews.map(r => (
          <article key={r.id} className="rounded-[1.75rem] border border-[rgba(6,182,212,0.1)] bg-white/[0.04] p-7">
            <p className="text-amber-400 text-lg mb-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
            <p className="text-[#f0fafb] leading-relaxed italic mb-4 text-sm">{r.comment}</p>
            <span className="text-[#06b6d4] font-bold text-sm">{r.name}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

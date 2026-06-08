'use client'

import { useStore } from '@/lib/store'
import { t, TranslationKey } from '@/lib/locale'

type Stat = { val: string; key: TranslationKey }
type Card = { titleKey: TranslationKey; descKey: TranslationKey; stats: [Stat, Stat] }

const CARDS: Card[] = [
  {
    titleKey: 'ana1_title', descKey: 'ana1_desc',
    stats: [{ val: '%8.7', key: 'ana1_l1' }, { val: '17', key: 'ana1_l2' }],
  },
  {
    titleKey: 'ana2_title', descKey: 'ana2_desc',
    stats: [{ val: '%58', key: 'ana2_l1' }, { val: '4.8', key: 'ana2_l2' }],
  },
  {
    titleKey: 'ana3_title', descKey: 'ana3_desc',
    stats: [{ val: '%97', key: 'ana3_l1' }, { val: '3–7', key: 'ana3_l2' }],
  },
]

export function AnalyticsSection() {
  const country = useStore(s => s.currentCountry)

  return (
    <section id="analytics" className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">
          {t(country, 'ana_eyebrow')}
        </span>
        <h2 className="text-4xl font-black mb-3">{t(country, 'ana_h2')}</h2>
        <p className="text-[#c4a896]">{t(country, 'ana_p')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CARDS.map(c => (
          <article key={c.titleKey} className="rounded-[1.75rem] border border-[rgba(255,154,60,0.1)] bg-white/[0.04] p-7">
            <h3 className="font-bold text-lg mb-2">{t(country, c.titleKey)}</h3>
            <p className="text-[#c4a896] text-sm leading-relaxed mb-5">{t(country, c.descKey)}</p>
            {c.stats.map(s => (
              <div key={s.key} className="flex items-baseline justify-between border-t border-white/[0.06] pt-4 mt-4">
                <span className="text-3xl font-black text-[#ff9a3c]">{s.val}</span>
                <span className="text-[#c4a896] text-sm">{t(country, s.key)}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}

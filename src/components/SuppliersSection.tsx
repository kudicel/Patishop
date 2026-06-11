'use client'

import { useStore } from '@/lib/store'
import { t, TranslationKey } from '@/lib/locale'

type Supplier = {
  name: string
  location: string
  descKey: TranslationKey
  featureKeys: [TranslationKey, TranslationKey, TranslationKey]
}

const SUPPLIERS: Supplier[] = [
  {
    name: 'PetTech Factory',
    location: 'Guangzhou, China',
    descKey: 'sup1_desc',
    featureKeys: ['sup1_f1', 'sup1_f2', 'sup1_f3'],
  },
  {
    name: 'PawTrend Yiwu',
    location: 'Yiwu, China',
    descKey: 'sup2_desc',
    featureKeys: ['sup2_f1', 'sup2_f2', 'sup2_f3'],
  },
  {
    name: 'PetComfort Factory',
    location: 'Ningbo, China',
    descKey: 'sup3_desc',
    featureKeys: ['sup3_f1', 'sup3_f2', 'sup3_f3'],
  },
]

export function SuppliersSection() {
  const country = useStore(s => s.currentCountry)

  return (
    <section id="suppliers" className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">
          {t(country, 'sup_eyebrow')}
        </span>
        <h2 className="text-4xl font-black mb-3">{t(country, 'sup_h2')}</h2>
        <p className="text-[#7ecad6] max-w-2xl">{t(country, 'sup_p')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SUPPLIERS.map(s => (
          <article key={s.name} className="rounded-[1.75rem] border border-[rgba(6,182,212,0.1)] bg-white/[0.04] p-7">
            <h3 className="font-bold text-lg mb-1">{s.name}</h3>
            <p className="text-[#06b6d4] text-xs font-bold mb-3">{s.location}</p>
            <p className="text-[#7ecad6] text-sm leading-relaxed mb-4">{t(country, s.descKey)}</p>
            <ul className="space-y-1.5">
              {s.featureKeys.map(fk => (
                <li key={fk} className="flex items-start gap-2 text-sm text-[#7ecad6]">
                  <span className="text-[#06b6d4] flex-shrink-0">✓</span>{t(country, fk)}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

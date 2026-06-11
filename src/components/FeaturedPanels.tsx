'use client'

import { useStore } from '@/lib/store'
import { t } from '@/lib/locale'

export function FeaturedPanels() {
  const country = useStore(s => s.currentCountry)

  const panels = [
    { icon: '🐾', titleKey: 'panel_smart_title' as const, descKey: 'panel_smart_desc' as const },
    { icon: '🎉', titleKey: 'panel_new_title'   as const, descKey: 'panel_new_desc'   as const },
    { icon: '⭐', titleKey: 'panel_top_title'   as const, descKey: 'panel_top_desc'   as const },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-8 lg:px-12">
      {panels.map(p => (
        <article key={p.titleKey}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 hover:border-[rgba(6,182,212,0.15)] transition-colors">
          <div className="text-3xl mb-3">{p.icon}</div>
          <h3 className="font-bold text-lg mb-2">{t(country, p.titleKey)}</h3>
          <p className="text-[#7ecad6] text-sm leading-relaxed">{t(country, p.descKey)}</p>
        </article>
      ))}
    </section>
  )
}

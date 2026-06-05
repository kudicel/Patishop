const CARDS = [
  { title:'Global Pazar', desc:'Dünya evcil hayvan pazarı 2025\'te 350 milyar USD\'ye ulaştı.', stats:[['%8.7','Yıllık global büyüme'],['17','Aktif ülke pazarı']] },
  { title:'En Çok Satan', desc:'AutoFeed Pro ve CleanBot Litter Pro bu ay rekor kırdı.', stats:[['%58','Akıllı cihaz satış artışı'],['4.8','Ortalama müşteri puanı']] },
  { title:'Teslimat & Stok', desc:'%97 zamanında teslimat, 14 gün iade garantisi.', stats:[['%97','Zamanında teslimat'],['3–7','Gün içinde kargo']] },
]

export function AnalyticsSection() {
  return (
    <section id="analytics" className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">Satış Analitiği</span>
        <h2 className="text-4xl font-black mb-3">Pazar büyümesi & ürün performansı</h2>
        <p className="text-[#c4a896]">Global evcil hayvan pazarı hızla büyüyor — doğru ürünle doğru zamanda pazar payı al.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CARDS.map(c => (
          <article key={c.title} className="rounded-[1.75rem] border border-[rgba(255,154,60,0.1)] bg-white/[0.04] p-7">
            <h3 className="font-bold text-lg mb-2">{c.title}</h3>
            <p className="text-[#c4a896] text-sm leading-relaxed mb-5">{c.desc}</p>
            {c.stats.map(([val,label]) => (
              <div key={label} className="flex items-baseline justify-between border-t border-white/[0.06] pt-4 mt-4">
                <span className="text-3xl font-black text-[#ff9a3c]">{val}</span>
                <span className="text-[#c4a896] text-sm">{label}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  )
}

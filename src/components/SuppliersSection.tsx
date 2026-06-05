const SUPPLIERS = [
  { name: 'PetTech Factory', location: 'Guangzhou, Çin', desc: 'Akıllı evcil hayvan cihazları üreticisi. 200+ ülkeye ihracat, 10 yıl tecrübe.', items: ['ISO 9001 & CE sertifikalı', 'WiFi cihazları ve uygulamalar', '500.000+ ünite/yıl üretim'] },
  { name: 'PawTrend Yiwu', location: 'Yiwu, Çin', desc: 'Yiwu aksesuar pazarının önde gelen ihracatçısı. Tasma, oyuncak ve kıyafet uzmanlığı.', items: ['EN71 & RoHS sertifikalı', '500+ SKU aksesuar çeşidi', 'B2B toplu sipariş fiyatı'] },
  { name: 'PetComfort Factory', location: 'Ningbo, Çin', desc: 'Yatak ve tekstil üreticisi. CertiPUR-US onaylı foam, OEKO-TEX kumaş.', items: ['Ortopedik ürün uzmanlığı', 'Özel beden & renk üretimi', 'Dünya geneli depo ağı'] },
]

export function SuppliersSection() {
  return (
    <section id="suppliers" className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">Tedarikçi & İthalat</span>
        <h2 className="text-4xl font-black mb-3">Doğrudan Çin fabrikasından, güvenle kapına</h2>
        <p className="text-[#c4a896] max-w-2xl">ISO ve CE sertifikalı üreticilerden ithal, dünya genelinde teslimat.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {SUPPLIERS.map(s => (
          <article key={s.name} className="rounded-[1.75rem] border border-[rgba(255,154,60,0.1)] bg-white/[0.04] p-7">
            <h3 className="font-bold text-lg mb-1">{s.name}</h3>
            <p className="text-[#ff9a3c] text-xs font-bold mb-3">{s.location}</p>
            <p className="text-[#c4a896] text-sm leading-relaxed mb-4">{s.desc}</p>
            <ul className="space-y-1.5">
              {s.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-[#c4a896]">
                  <span className="text-[#ff9a3c] flex-shrink-0">✓</span>{item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

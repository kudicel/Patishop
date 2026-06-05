export function FeaturedPanels() {
  const panels = [
    { icon: '🐾', title: 'Akıllı Bakım', desc: 'WiFi kontrollü mama kapları ve otomatik kum temizleyicilerle bakım artık çok kolay.' },
    { icon: '🎉', title: 'Yeni Gelenler',  desc: 'Her hafta Çin\'den gelen yeni koleksiyonlar — kıyafetler, oyuncak setleri ve lüks yataklar.' },
    { icon: '⭐', title: 'En Çok Satanlar', desc: 'Müşteri değerlendirmelerinde en yüksek puanı alan ürünler, hızlı kargo garantisi ile.' },
  ]
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-6 pb-8 lg:px-12">
      {panels.map(p => (
        <article key={p.title}
          className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-7 hover:border-[rgba(255,154,60,0.15)] transition-colors">
          <div className="text-3xl mb-3">{p.icon}</div>
          <h3 className="font-bold text-lg mb-2">{p.title}</h3>
          <p className="text-[#c4a896] text-sm leading-relaxed">{p.desc}</p>
        </article>
      ))}
    </section>
  )
}

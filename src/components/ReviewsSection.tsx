const REVIEWS = [
  { text: '"AutoFeed Pro X1\'i aldım, artık geç kaldığımda kedim aç kalmıyor. Uygulamadan anlık takip çok kullanışlı."', author: 'Selin K., İstanbul', stars: '★★★★★' },
  { text: '"CleanBot Litter Pro sessiz çalışıyor, kedi fark etmiyor bile. Bu fiyata bu kalite inanılmaz."', author: 'Mehmet A., Ankara', stars: '★★★★★' },
  { text: '"CloudNap yatak harika, köpeğim her gece orada uyuyor. Kılıf çıkarılıp kolayca yıkanıyor."', author: 'Deniz T., İzmir', stars: '★★★★★' },
]

export function ReviewsSection() {
  return (
    <section className="px-6 lg:px-12 pb-20">
      <div className="mb-10">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#ff9a3c] mb-3">Müşteri Yorumları</span>
        <h2 className="text-4xl font-black">Gerçek evcil hayvan sahiplerinden</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {REVIEWS.map((r, i) => (
          <article key={i} className="rounded-[1.75rem] border border-[rgba(255,154,60,0.1)] bg-white/[0.04] p-7">
            <p className="text-amber-400 text-lg mb-3">{r.stars}</p>
            <p className="text-[#fff8f4] leading-relaxed italic mb-4 text-sm">{r.text}</p>
            <span className="text-[#ff9a3c] font-bold text-sm">{r.author}</span>
          </article>
        ))}
      </div>
    </section>
  )
}

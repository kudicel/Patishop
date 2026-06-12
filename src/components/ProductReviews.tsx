'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  name: string
  rating: number
  comment: string
  createdAt: string
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews]   = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ name: '', rating: 5, comment: '' })

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(data => { setReviews(data); setLoading(false) })
  }, [productId])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, ...form }),
    })
    if (res.ok) {
      setSubmitted(true)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Bir hata oluştu')
    }
  }

  return (
    <section className="mt-16 pt-10 border-t border-white/[0.08]">
      <h2 className="text-2xl font-black mb-8">Müşteri Yorumları</h2>

      {/* Mevcut yorumlar */}
      {loading ? (
        <p className="text-[#7ecad6] text-sm mb-8">Yorumlar yükleniyor...</p>
      ) : reviews.length === 0 ? (
        <p className="text-[#7ecad6] text-sm mb-8">Henüz yorum yok. İlk yorumu siz yazın!</p>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {reviews.map(r => (
            <div key={r.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm">{r.name}</span>
                <span className="text-amber-400">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className="text-[#c4a896] text-sm leading-relaxed">{r.comment}</p>
              <p className="text-[#7ecad6] text-xs mt-2">{new Date(r.createdAt).toLocaleDateString('tr-TR')}</p>
            </div>
          ))}
        </div>
      )}

      {/* Yorum formu */}
      <div className="rounded-2xl border border-[rgba(6,182,212,0.15)] bg-[rgba(6,182,212,0.03)] p-6">
        <h3 className="font-black text-lg mb-5">Yorum Yaz</h3>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-[#06b6d4] font-bold text-lg mb-2">Teşekkürler! 🎉</p>
            <p className="text-[#7ecad6] text-sm">Yorumunuz incelendikten sonra yayınlanacak.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#7ecad6] font-semibold mb-1.5 block">Adınız</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                    text-white placeholder-[#7ecad6] outline-none focus:border-[#06b6d4] transition-colors"
                  placeholder="Adınızı girin"
                />
              </div>
              <div>
                <label className="text-xs text-[#7ecad6] font-semibold mb-1.5 block">Puan</label>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? 'text-amber-400' : 'text-white/20'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs text-[#7ecad6] font-semibold mb-1.5 block">Yorumunuz</label>
              <textarea
                required
                rows={4}
                value={form.comment}
                onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                  text-white placeholder-[#7ecad6] outline-none focus:border-[#06b6d4] transition-colors resize-none"
                placeholder="Ürün hakkındaki deneyiminizi paylaşın..."
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" className="btn-brand rounded-full py-3 font-bold self-start px-8">
              Yorumu Gönder
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const TEST_CARDS = [
  { number: '4242 4242 4242 4242', label: 'Başarılı ödeme',   result: 'success' },
  { number: '4000 0000 0000 0002', label: 'Reddedilen kart',  result: 'fail' },
]

function MockPaymentForm() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const orderId      = searchParams.get('orderId') ?? ''

  const [card,    setCard]    = useState('4242 4242 4242 4242')
  const [expiry,  setExpiry]  = useState('12/30')
  const [cvv,     setCvv]     = useState('123')
  const [name,    setName]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function pay() {
    if (!name.trim()) { setError('Kart üzerindeki adı girin.'); return }
    setLoading(true)
    setError('')

    const isSuccess = card.replace(/\s/g, '') === '4242424242424242'

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1200))

    if (!isSuccess) {
      setLoading(false)
      setError('Kart reddedildi. Başarılı test kartını deneyin.')
      return
    }

    // Update order status via mock-only endpoint (no admin auth required)
    await fetch('/api/payment/mock/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })

    router.push(`/order-success?id=${orderId}`)
  }

  function formatCard(val: string) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
  }

  return (
    <div className="min-h-screen bg-[#0a0602] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[#ff9a3c] font-black text-xl">PatiShop</Link>
        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10
          border border-yellow-400/20 rounded-full px-3 py-1">
          <span>⚠</span> Test Modu
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-black mb-1">Ödeme</h1>
        <p className="text-[#c4a896] text-sm mb-8">Kart bilgilerinizi girin</p>

        {/* Test card hints */}
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 mb-6 space-y-2">
          <p className="text-xs text-[#c4a896] uppercase tracking-wide font-semibold mb-3">Test Kartları</p>
          {TEST_CARDS.map(tc => (
            <button
              key={tc.number}
              onClick={() => setCard(tc.number)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs
                transition-colors text-left
                ${card === tc.number
                  ? 'bg-[rgba(255,154,60,0.12)] border border-[rgba(255,154,60,0.3)] text-white'
                  : 'hover:bg-white/[0.04] text-[#c4a896]'}`}
            >
              <span className="font-mono">{tc.number}</span>
              <span className={tc.result === 'success' ? 'text-green-400' : 'text-red-400'}>
                {tc.label}
              </span>
            </button>
          ))}
        </div>

        {/* Card form */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
          {/* Card number */}
          <div>
            <label className="block text-xs font-semibold text-[#c4a896] uppercase tracking-wide mb-1.5">
              Kart Numarası
            </label>
            <input
              value={card}
              onChange={e => setCard(formatCard(e.target.value))}
              placeholder="0000 0000 0000 0000"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3
                text-sm font-mono focus:outline-none focus:border-[#ff9a3c]/60 transition-colors"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#c4a896] uppercase tracking-wide mb-1.5">
              Kart Üzerindeki Ad
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value.toUpperCase())}
              placeholder="AD SOYAD"
              className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3
                text-sm focus:outline-none focus:border-[#ff9a3c]/60 transition-colors"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#c4a896] uppercase tracking-wide mb-1.5">
                Son Kullanma
              </label>
              <input
                value={expiry}
                onChange={e => setExpiry(formatExpiry(e.target.value))}
                placeholder="AA/YY"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3
                  text-sm font-mono focus:outline-none focus:border-[#ff9a3c]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#c4a896] uppercase tracking-wide mb-1.5">
                CVV
              </label>
              <input
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                type="password"
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3
                  text-sm font-mono focus:outline-none focus:border-[#ff9a3c]/60 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            onClick={pay}
            disabled={loading}
            className="w-full btn-brand rounded-full py-3.5 font-bold text-sm
              disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                İşleniyor...
              </span>
            ) : 'Ödemeyi Tamamla'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[#c4a896]">
          <span>🔒</span>
          <span>Bu bir test ortamıdır — gerçek ödeme alınmaz</span>
        </div>
      </div>
    </div>
  )
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0602] flex items-center justify-center text-[#c4a896]">
        Yükleniyor...
      </div>
    }>
      <MockPaymentForm />
    </Suspense>
  )
}

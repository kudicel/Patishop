'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PayTRPaymentForm() {
  const searchParams = useSearchParams()
  const orderId      = searchParams.get('orderId') ?? ''

  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Fetch PayTR token once orderId is known
  useEffect(() => {
    if (!orderId) {
      setError('Geçersiz sipariş. Lütfen tekrar deneyin.')
      return
    }
    fetch('/api/payment/paytr/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
      .then(r => r.json())
      .then((data: { token?: string; error?: string }) => {
        if (data.token) setToken(data.token)
        else setError(data.error ?? 'Ödeme başlatılamadı.')
      })
      .catch(() => setError('Sunucu hatası. Lütfen tekrar deneyin.'))
  }, [orderId])

  // PayTR iframe height via postMessage — registered once, cleaned up on unmount
  useEffect(() => {
    if (!token) return
    const handler = (e: MessageEvent) => {
      if (e.origin !== 'https://www.paytr.com') return
      const iframe = document.getElementById('paytriframe') as HTMLIFrameElement | null
      if (iframe && typeof e.data === 'number') iframe.style.height = e.data + 'px'
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [token])

  return (
    <div className="min-h-screen bg-[#050f12] text-white">
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[#06b6d4] font-black text-xl">PatiShop</Link>
        <div className="flex items-center gap-2 text-xs text-[#7ecad6] bg-white/[0.04]
          border border-white/[0.08] rounded-full px-3 py-1">
          🔒 Güvenli Ödeme
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-10">
        {error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center space-y-4">
            <p className="text-red-400 font-semibold">{error}</p>
            <p className="text-xs text-white/40">
              Sorun devam ederse <a href="mailto:destek@patishop.tr"
                className="text-[#06b6d4] hover:underline">destek@patishop.tr</a> adresine yazın.
            </p>
            <Link href="/"
              className="inline-block btn-brand px-8 py-3 rounded-full text-sm font-bold">
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : !token ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-[#7ecad6]">
            <div className="w-10 h-10 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Ödeme sayfası yükleniyor...</p>
          </div>
        ) : (
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            style={{ width: '100%', minHeight: '600px', border: 'none', overflow: 'hidden' }}
          />
        )}
      </div>
    </div>
  )
}

export default function PayTRPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050f12] flex items-center justify-center text-[#7ecad6]">
        Yükleniyor...
      </div>
    }>
      <PayTRPaymentForm />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function IyzicoPaymentForm() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [html,    setHtml]    = useState<string | null>(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { setError('Sipariş ID eksik.'); setLoading(false); return }

    fetch('/api/payment/iyzico/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    })
      .then(r => r.json())
      .then((data: { checkoutFormContent?: string; error?: string }) => {
        if (data.error) { setError(data.error); return }
        setHtml(data.checkoutFormContent ?? '')
      })
      .catch(() => setError('Ödeme formu yüklenemedi.'))
      .finally(() => setLoading(false))
  }, [orderId])

  // Inject the iyzico checkout form HTML into the page
  // iyzico's script inside the HTML handles the iframe/form rendering
  useEffect(() => {
    if (!html) return
    const container = document.getElementById('iyzico-checkout-form')
    if (!container) return
    container.innerHTML = html

    // Re-execute any script tags inside the HTML
    container.querySelectorAll('script').forEach(oldScript => {
      const newScript = document.createElement('script')
      if (oldScript.src) {
        newScript.src = oldScript.src
        newScript.async = true
      } else {
        newScript.textContent = oldScript.textContent
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  if (loading) return (
    <div className="min-h-screen bg-[#050f12] flex items-center justify-center text-[#7ecad6]">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#06b6d4] border-t-transparent rounded-full
          animate-spin mx-auto mb-4" />
        <p className="text-sm">Ödeme formu hazırlanıyor...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-[#050f12] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30
          flex items-center justify-center text-3xl mx-auto mb-4">✗</div>
        <p className="text-white font-bold mb-2">Ödeme başlatılamadı</p>
        <p className="text-[#7ecad6] text-sm mb-6">{error}</p>
        <Link href="/" className="btn-brand px-6 py-2.5 rounded-full text-sm font-bold">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#050f12]">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[#06b6d4] font-black text-xl tracking-tight">PatiShop</Link>
        <div className="flex items-center gap-2 text-xs text-[#7ecad6]">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-green-400 flex items-center justify-center text-green-400">✓</span>
          Güvenli Ödeme — iyzico
        </div>
      </div>

      {/* iyzico injects its form here */}
      <div id="iyzico-checkout-form" className="max-w-lg mx-auto px-4 py-8" />
    </div>
  )
}

export default function IyzicoPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050f12] flex items-center justify-center text-[#7ecad6]">
        Yükleniyor...
      </div>
    }>
      <IyzicoPaymentForm />
    </Suspense>
  )
}

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function FailContent() {
  const params  = useSearchParams()
  const orderId = params.get('id') ?? ''

  const [orderNumber, setOrderNumber] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) return
    fetch(`/api/orders/${orderId}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { orderNumber?: string } | null) => {
        if (data?.orderNumber) setOrderNumber(data.orderNumber)
      })
      .catch(() => null)
  }, [orderId])

  return (
    <div className="min-h-screen bg-[#050f12] text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30
          flex items-center justify-center mx-auto text-3xl">
          ✕
        </div>
        <h1 className="text-2xl font-black">Ödeme Başarısız</h1>
        <p className="text-[#7ecad6] text-sm">
          Ödemeniz tamamlanamadı. Lütfen kart bilgilerinizi kontrol ederek tekrar deneyin.
        </p>
        {orderNumber && (
          <p className="text-xs text-white/30">Sipariş No: #{orderNumber}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link href={orderId ? `/checkout/payment/paytr?orderId=${orderId}` : '/checkout'}
            className="btn-brand rounded-full py-3.5 font-bold text-sm text-center">
            Tekrar Dene
          </Link>
          <Link href="/"
            className="rounded-full py-3.5 font-bold text-sm border border-white/15
              hover:border-white/30 transition-colors text-center">
            Ana Sayfaya Dön
          </Link>
        </div>
        <p className="text-xs text-white/25">
          Sorun devam ederse{' '}
          <a href="mailto:destek@patishop.tr" className="text-[#06b6d4] hover:underline">
            destek@patishop.tr
          </a>
        </p>
      </div>
    </div>
  )
}

export default function PayTRFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050f12] flex items-center justify-center text-[#7ecad6]">
        Yükleniyor...
      </div>
    }>
      <FailContent />
    </Suspense>
  )
}

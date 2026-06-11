'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function FailContent() {
  const params  = useSearchParams()
  const orderId = params.get('id') ?? ''

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
        {orderId && (
          <p className="text-xs text-white/30">Sipariş No: {orderId}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/checkout"
            className="btn-brand rounded-full py-3.5 font-bold text-sm text-center">
            Tekrar Dene
          </Link>
          <Link href="/"
            className="rounded-full py-3.5 font-bold text-sm border border-white/15
              hover:border-white/30 transition-colors text-center">
            Ana Sayfaya Dön
          </Link>
        </div>
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

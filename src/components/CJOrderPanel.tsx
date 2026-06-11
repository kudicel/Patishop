'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TrackEvent = {
  trackingTime: string
  trackingDetail: string
  trackingLocation?: string
}

type TrackInfo = {
  trackNumber?: string
  logisticName?: string
  trackingInfos?: TrackEvent[]
}

export function CJOrderPanel({
  orderId,
  initialCjOrderId,
  initialCjStatus,
}: {
  orderId: string
  initialCjOrderId: string | null
  initialCjStatus: string | null
}) {
  const router = useRouter()
  const [cjOrderId, setCjOrderId] = useState(initialCjOrderId)
  const [cjStatus,  setCjStatus]  = useState(initialCjStatus)
  const [fulfilling, setFulfilling] = useState(false)
  const [fulfillError, setFulfillError] = useState('')

  const [trackInfo,    setTrackInfo]    = useState<TrackInfo | null>(null)
  const [trackLoading, setTrackLoading] = useState(false)
  const [trackError,   setTrackError]   = useState('')
  const [trackOpen,    setTrackOpen]    = useState(false)

  async function fulfill() {
    setFulfilling(true)
    setFulfillError('')
    const res = await fetch(`/api/admin/orders/${orderId}/cj-fulfill`, { method: 'POST' })
    const data = await res.json()
    setFulfilling(false)
    if (res.ok) {
      setCjOrderId(data.cjOrderId)
      setCjStatus(data.cjStatus)
      router.refresh()
    } else {
      setFulfillError(data.error ?? 'Bir hata oluştu.')
    }
  }

  async function loadTracking() {
    if (trackOpen) { setTrackOpen(false); return }
    setTrackLoading(true)
    setTrackError('')
    setTrackOpen(true)
    const res = await fetch(`/api/admin/orders/${orderId}/cj-track`)
    const data = await res.json()
    setTrackLoading(false)
    if (res.ok) {
      setTrackInfo(data)
    } else {
      setTrackError(data.error ?? 'Takip bilgisi alınamadı.')
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
      <h3 className="font-bold text-sm text-[#7ecad6] uppercase tracking-wide">CJ Dropshipping</h3>

      {cjOrderId ? (
        <>
          {/* Status & ID */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-[#7ecad6]">CJ Sipariş ID</span>
              <span className="font-mono text-xs text-white/80 truncate max-w-[140px]">{cjOrderId}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-[#7ecad6]">Durum</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                cjStatus === 'created'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : cjStatus === 'shipped'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : 'bg-white/[0.06] text-[#7ecad6] border-white/[0.1]'
              }`}>
                {cjStatus ?? 'bilinmiyor'}
              </span>
            </div>
          </div>

          {/* Tracking toggle */}
          <button
            onClick={loadTracking}
            className="w-full py-2 rounded-xl border border-[#06b6d4]/30 text-[#06b6d4] text-sm
              font-semibold hover:bg-[rgba(6,182,212,0.08)] transition-colors"
          >
            {trackOpen ? '▲ Takibi Gizle' : '▼ Kargo Takibi'}
          </button>

          {trackOpen && (
            <div className="space-y-2">
              {trackLoading && (
                <p className="text-xs text-[#7ecad6] text-center py-3">Yükleniyor...</p>
              )}
              {trackError && (
                <p className="text-xs text-red-400 text-center py-3">{trackError}</p>
              )}
              {!trackInfo && !trackLoading && !trackError && (
                <p className="text-xs text-[#7ecad6] text-center py-2">Henüz takip bilgisi yok.</p>
              )}
              {trackInfo && !trackLoading && (
                <>
                  {trackInfo.trackNumber && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7ecad6]">Takip No</span>
                      <span className="font-mono">{trackInfo.trackNumber}</span>
                    </div>
                  )}
                  {trackInfo.logisticName && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[#7ecad6]">Kargo Firması</span>
                      <span>{trackInfo.logisticName}</span>
                    </div>
                  )}
                  {trackInfo.trackingInfos && trackInfo.trackingInfos.length > 0 ? (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                      {trackInfo.trackingInfos.map((ev, i) => (
                        <div key={i} className="flex gap-3 text-xs">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#06b6d4]' : 'bg-white/20'}`} />
                          </div>
                          <div>
                            <p className="text-white/80">{ev.trackingDetail}</p>
                            {ev.trackingLocation && (
                              <p className="text-[#7ecad6]">{ev.trackingLocation}</p>
                            )}
                            <p className="text-white/30 mt-0.5">{ev.trackingTime}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !trackLoading && <p className="text-xs text-[#7ecad6] text-center py-2">Henüz takip bilgisi yok.</p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-xs text-[#7ecad6]">
            Bu sipariş henüz CJ&apos;ye iletilmedi. Ürünlerde CJ variant bağlıysa aşağıdan manuel iletebilirsin.
          </p>
          {fulfillError && <p className="text-xs text-red-400">{fulfillError}</p>}
          <button
            onClick={fulfill}
            disabled={fulfilling}
            className="w-full btn-brand rounded-full py-2.5 text-sm font-bold
              disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            {fulfilling ? 'İletiliyor...' : "CJ'ye İlet"}
          </button>
        </>
      )}
    </div>
  )
}

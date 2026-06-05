'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ORDER_STATUSES, statusClass, statusLabel } from '@/lib/orderStatus'

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const router  = useRouter()
  const [status,  setStatus]  = useState(currentStatus)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const changed = status !== currentStatus

  async function save() {
    setSaving(true)
    setError('')
    setSaved(false)
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    } else {
      setError('Kaydedilemedi.')
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
      <h3 className="font-bold text-sm text-[#c4a896] uppercase tracking-wide">Sipariş Durumu</h3>

      <div className="flex items-center gap-3">
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusClass(currentStatus)}`}>
          {statusLabel(currentStatus)}
        </span>
        {changed && (
          <>
            <span className="text-[#c4a896]">→</span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusClass(status)}`}>
              {statusLabel(status)}
            </span>
          </>
        )}
      </div>

      <select
        value={status}
        onChange={e => { setStatus(e.target.value); setSaved(false) }}
        className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-3 text-sm
          text-white focus:outline-none focus:border-[#ff9a3c]/60 transition-colors"
      >
        {ORDER_STATUSES.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={save}
        disabled={!changed || saving}
        className="w-full btn-brand rounded-full py-2.5 text-sm font-bold
          disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
      >
        {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Durumu Güncelle'}
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type Coupon = {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  minOrderTRY: number
  maxUses: number
  usedCount: number
  active: boolean
  expiresAt: string | null
  createdAt: string
}

const inputCls = 'bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#06b6d4]/60 transition-colors'

export default function AdminCouponsPage() {
  const router = useRouter()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [form, setForm] = useState({
    code: '', type: 'percent', value: 10, minOrderTRY: 0, maxUses: 0,
    active: true, expiresAt: '',
  })

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/coupons')
    const data = await res.json()
    setCoupons(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!form.code.trim()) return
    setSaving(true)
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setForm({ code: '', type: 'percent', value: 10, minOrderTRY: 0, maxUses: 0, active: true, expiresAt: '' })
    await load()
    router.refresh()
  }

  async function remove(id: string) {
    await fetch('/api/admin/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
    router.refresh()
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-black mb-1">İndirim Kuponları</h1>
      <p className="text-[#7ecad6] text-sm mb-8">Kupon oluştur, listele, sil.</p>

      {/* Create form */}
      <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.03)] p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Yeni Kupon</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">Kod</label>
            <input className={`${inputCls} w-full uppercase`} placeholder="HOSGELDIN10"
              value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
          </div>
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">Tür</label>
            <select className={`${inputCls} w-full`} value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              <option value="percent">Yüzde (%)</option>
              <option value="fixed">Sabit Tutar (₺)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">
              Değer {form.type === 'percent' ? '(%)' : '(₺)'}
            </label>
            <input className={`${inputCls} w-full`} type="number" min={1}
              value={form.value} onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">Min. Sipariş (₺)</label>
            <input className={`${inputCls} w-full`} type="number" min={0}
              value={form.minOrderTRY} onChange={e => setForm(f => ({ ...f, minOrderTRY: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">Max Kullanım (0=sınırsız)</label>
            <input className={`${inputCls} w-full`} type="number" min={0}
              value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-xs text-[#7ecad6] mb-1.5 font-bold">Son Kullanma Tarihi</label>
            <input className={`${inputCls} w-full`} type="date"
              value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </div>
        </div>
        <button onClick={create} disabled={saving || !form.code.trim()}
          className="mt-4 btn-brand px-8 py-2.5 rounded-full text-sm font-bold disabled:opacity-40">
          {saving ? 'Oluşturuluyor...' : 'Kupon Oluştur'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-[#7ecad6] text-sm">Yükleniyor...</p>
      ) : coupons.length === 0 ? (
        <p className="text-[#7ecad6] text-sm">Henüz kupon yok.</p>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#7ecad6] text-xs uppercase tracking-wide border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3 text-left">Kod</th>
                <th className="px-5 py-3 text-left">İndirim</th>
                <th className="px-5 py-3 text-center">Kullanım</th>
                <th className="px-5 py-3 text-center">Durum</th>
                <th className="px-5 py-3 text-left">Son Kullanma</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-[#06b6d4]">{c.code}</td>
                  <td className="px-5 py-3 text-white">
                    {c.type === 'percent' ? `%${c.value}` : `${c.value}₺`}
                    {c.minOrderTRY > 0 && <span className="text-xs text-[#7ecad6] ml-1.5">min {c.minOrderTRY}₺</span>}
                  </td>
                  <td className="px-5 py-3 text-center text-[#7ecad6]">
                    {c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ''}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      c.active
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {c.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[#7ecad6] text-xs">
                    {c.expiresAt
                      ? new Date(c.expiresAt).toLocaleDateString('tr-TR')
                      : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(c.id)}
                      className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg px-3 py-1 transition-colors">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

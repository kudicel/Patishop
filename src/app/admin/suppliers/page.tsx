'use client'

import { useEffect, useState } from 'react'

type ProductStub = { id: string; name: string; category: string }


type Supplier = {
  id:         string
  name:       string
  email:      string
  phone:      string | null
  country:    string
  productIds: string[]
  active:     boolean
  notes:      string | null
}

const empty: Omit<Supplier, 'id'> = {
  name: '', email: '', phone: '', country: 'CN',
  productIds: [], active: true, notes: '',
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [products,  setProducts]  = useState<ProductStub[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [form,      setForm]      = useState<Omit<Supplier, 'id'>>(empty)
  const [editId,    setEditId]    = useState<string | null>(null)
  const [showForm,  setShowForm]  = useState(false)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    loadSuppliers()
    fetch('/api/public/products').then(r => r.json()).then(setProducts).catch(() => {})
  }, [])

  async function loadSuppliers() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/admin/suppliers')
      const text = await res.text()
      if (!res.ok) { setError(`API Hatası ${res.status}: ${text}`); setLoading(false); return }
      const data = text ? JSON.parse(text) : []
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(String(e))
    }
    setLoading(false)
  }

  function openAdd() {
    setForm(empty)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(s: Supplier) {
    setForm({ name: s.name, email: s.email, phone: s.phone ?? '', country: s.country,
              productIds: s.productIds, active: s.active, notes: s.notes ?? '' })
    setEditId(s.id)
    setShowForm(true)
  }

  async function save() {
    setSaving(true)
    const url    = editId ? `/api/admin/suppliers/${editId}` : '/api/admin/suppliers'
    const method = editId ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setShowForm(false)
    loadSuppliers()
  }

  async function remove(id: string) {
    if (!confirm('Bu tedarikçiyi silmek istediğinizden emin misiniz?')) return
    await fetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' })
    loadSuppliers()
  }

  function toggleProduct(pid: string) {
    setForm(f => ({
      ...f,
      productIds: f.productIds.includes(pid)
        ? f.productIds.filter(x => x !== pid)
        : [...f.productIds, pid],
    }))
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <span className="w-6 h-6 border-2 border-[#06b6d4] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full overflow-hidden">

      {/* Sol: Tedarikçi Listesi */}
      <div className={`flex flex-col p-8 overflow-y-auto transition-all duration-300 ${showForm ? 'w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">Tedarikçiler</h1>
            <p className="text-[#7ecad6] text-sm mt-0.5">Sipariş gelince otomatik email gönderilir</p>
          </div>
          <button onClick={openAdd}
            className="btn-brand px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap">
            + Tedarikçi Ekle
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 text-sm font-mono">
            {error}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-24 text-[#7ecad6]">
            <p className="text-4xl mb-4">🏭</p>
            <p>Henüz tedarikçi yok. Ekle butonuna bas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {suppliers.map(s => (
              <div key={s.id}
                className={`flex items-start justify-between gap-4 rounded-2xl border p-5 transition-colors
                  ${editId === s.id
                    ? 'border-[rgba(6,182,212,0.4)] bg-[rgba(6,182,212,0.06)]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-[rgba(6,182,212,0.2)]'}`}>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">{s.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      s.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {s.active ? 'Aktif' : 'Pasif'}
                    </span>
                    <span className="text-xs text-[#7ecad6] bg-white/5 px-2 py-0.5 rounded-full">
                      {s.country}
                    </span>
                  </div>

                  <p className="text-[#7ecad6] text-sm">{s.email}
                    {s.phone && <span className="ml-3 opacity-70">{s.phone}</span>}
                  </p>

                  {s.productIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.productIds.map(pid => {
                        const p = products.find(x => x.id === pid)
                        return (
                          <span key={pid} className="text-xs bg-[rgba(6,182,212,0.1)] text-[#06b6d4]
                            border border-[rgba(6,182,212,0.2)] px-2 py-0.5 rounded-full">
                            {p?.name ?? pid}
                          </span>
                        )
                      })}
                    </div>
                  )}

                  {s.notes && <p className="text-xs text-[#7ecad6] mt-2 opacity-70">{s.notes}</p>}
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(s)}
                    className="btn-ghost px-3 py-1.5 rounded-xl text-xs font-semibold">
                    Düzenle
                  </button>
                  <button onClick={() => remove(s.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-red-500/20
                      text-red-400 hover:bg-red-500/10 transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sağ: Form Paneli */}
      {showForm && (
        <div className="w-1/2 border-l border-white/[0.06] p-8 overflow-y-auto bg-[rgba(6,182,212,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">
              {editId ? 'Tedarikçiyi Düzenle' : 'Yeni Tedarikçi'}
            </h2>
            <button onClick={() => setShowForm(false)}
              className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center
                text-lg hover:bg-white/10 transition-colors">
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#7ecad6] block mb-1.5">Ad / Firma</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:border-[#06b6d4]" placeholder="Örn: ShenzhenPet Co." />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7ecad6] block mb-1.5">Email</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:border-[#06b6d4]" placeholder="factory@example.cn" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#7ecad6] block mb-1.5">Telefon</label>
                <input value={form.phone ?? ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:border-[#06b6d4]" placeholder="+86 ..." />
              </div>
              <div>
                <label className="text-xs font-bold text-[#7ecad6] block mb-1.5">Ülke</label>
                <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                    focus:outline-none focus:border-[#06b6d4]" placeholder="CN" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#7ecad6] block mb-2">
                Tedarik Ettiği Ürünler ({form.productIds.length} seçili)
              </label>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {products.map(p => (
                  <label key={p.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-sm
                      ${form.productIds.includes(p.id)
                        ? 'border-[rgba(6,182,212,0.4)] bg-[rgba(6,182,212,0.08)] text-white'
                        : 'border-white/[0.06] text-[#7ecad6] hover:border-white/20'}`}>
                    <input type="checkbox" className="accent-[#06b6d4] flex-shrink-0"
                      checked={form.productIds.includes(p.id)}
                      onChange={() => toggleProduct(p.id)} />
                    <span>{p.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#7ecad6] block mb-1.5">Notlar</label>
              <textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:border-[#06b6d4] resize-none"
                placeholder="Minimum sipariş miktarı, ödeme koşulları..." />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-[#06b6d4] w-4 h-4"
                checked={form.active}
                onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
              <span className="text-sm">Aktif (sipariş emaili gönderilsin)</span>
            </label>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={() => setShowForm(false)}
              className="btn-ghost flex-1 py-3 rounded-full text-sm font-semibold">
              İptal
            </button>
            <button onClick={save} disabled={saving || !form.name || !form.email}
              className="btn-brand flex-1 py-3 rounded-full text-sm font-bold disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

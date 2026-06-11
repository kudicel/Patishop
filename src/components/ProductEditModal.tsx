'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

type ProductRow = {
  id: string
  name: string
  category: string
  categoryLabel: string
  price: number
  rating: number
  reviewCount: number
  badge: string | null
  images: string[]
  thumbImage: string
  shortDesc: string
  description: string
  features: string[]
  colors: string[]
  sizes: string[]
  supplier: string
  supplierNote: string
  active: boolean
}

type Form = Omit<ProductRow, 'id'>

function toForm(p: ProductRow): Form {
  return {
    name:          p.name,
    category:      p.category,
    categoryLabel: p.categoryLabel,
    price:         p.price,
    rating:        p.rating,
    reviewCount:   p.reviewCount,
    badge:         p.badge ?? '',
    images:        p.images,
    thumbImage:    p.thumbImage,
    shortDesc:     p.shortDesc,
    description:   p.description,
    features:      p.features,
    colors:        p.colors,
    sizes:         p.sizes,
    supplier:      p.supplier,
    supplierNote:  p.supplierNote,
    active:        p.active,
  }
}

const CATEGORIES = [
  { value: 'mama-kabi',       label: 'Mama Kabı' },
  { value: 'kum-temizleyici', label: 'Kum Temizleyici' },
  { value: 'tasma',           label: 'Tasma' },
  { value: 'oyuncak',         label: 'Oyuncak' },
  { value: 'kiyafet',         label: 'Kıyafet' },
  { value: 'yatak',           label: 'Yatak' },
]

const BADGES = ['', 'Çok Satan', 'En İyi Değer', 'Premium', 'Bütçe Dostu', 'Yeni', 'Yeni Sezon']

const inputCls = 'w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#06b6d4]/60 transition-colors'
const labelCls = 'block text-xs font-bold text-[#7ecad6] mb-1.5'

export function ProductEditModal({
  product,
  onClose,
}: {
  product: ProductRow
  onClose: () => void
}) {
  const router = useRouter()
  const [form, setForm] = useState<Form>(toForm(product))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  // Reset form when product changes
  useEffect(() => { setForm(toForm(product)); setSaved(false); setError('') }, [product])

  // Esc to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  const set = useCallback(<K extends keyof Form>(key: K, val: Form[K]) => {
    setForm(f => ({ ...f, [key]: val }))
    setSaved(false)
  }, [])

  // Array helpers (comma/newline separated text ↔ string[])
  function arrToText(arr: string[]) { return arr.join('\n') }
  function textToArr(text: string) {
    return text.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
  }

  async function save() {
    setSaving(true)
    setError('')
    const body = { ...form, badge: form.badge || null }
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
    } else {
      const d = await res.json().catch(() => ({}))
      setError(d.error ?? 'Kaydedilemedi.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-2xl h-full overflow-y-auto bg-[#060f12] border-l border-[rgba(6,182,212,0.15)] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#060f12] border-b border-white/[0.06]">
          <div>
            <h2 className="font-black text-lg">Ürün Düzenle</h2>
            <p className="text-xs text-[#7ecad6] mt-0.5 font-mono">{product.id}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-colors">
            ×
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-8">

          {/* Temel Bilgiler */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Temel Bilgiler</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Ürün Adı</label>
                  <input className={inputCls} value={form.name}
                    onChange={e => set('name', e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Fiyat (TRY)</label>
                  <input className={inputCls} type="number" min={0} value={form.price}
                    onChange={e => set('price', Number(e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Kategori</label>
                  <select className={inputCls} value={form.category}
                    onChange={e => {
                      const cat = CATEGORIES.find(c => c.value === e.target.value)
                      set('category', e.target.value)
                      if (cat) set('categoryLabel', cat.label)
                    }}>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Kategori Etiketi</label>
                  <input className={inputCls} value={form.categoryLabel}
                    onChange={e => set('categoryLabel', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Badge</label>
                  <select className={inputCls} value={form.badge ?? ''}
                    onChange={e => set('badge', e.target.value)}>
                    {BADGES.map(b => <option key={b} value={b}>{b || '(yok)'}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Puan</label>
                  <input className={inputCls} type="number" min={0} max={5} step={0.1}
                    value={form.rating}
                    onChange={e => set('rating', Number(e.target.value))} />
                </div>
                <div>
                  <label className={labelCls}>Yorum Sayısı</label>
                  <input className={inputCls} type="number" min={0}
                    value={form.reviewCount}
                    onChange={e => set('reviewCount', Number(e.target.value))} />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-[#06b6d4] w-4 h-4"
                  checked={form.active}
                  onChange={e => set('active', e.target.checked)} />
                <span className="text-sm">Aktif (sitede göster)</span>
              </label>
            </div>
          </section>

          {/* İçerik */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">İçerik</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Kısa Açıklama</label>
                <input className={inputCls} value={form.shortDesc}
                  onChange={e => set('shortDesc', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Uzun Açıklama</label>
                <textarea className={`${inputCls} resize-none`} rows={4} value={form.description}
                  onChange={e => set('description', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Özellikler <span className="font-normal opacity-60">(her satır bir özellik)</span></label>
                <textarea className={`${inputCls} resize-none font-mono text-xs`} rows={6}
                  value={arrToText(form.features)}
                  onChange={e => set('features', textToArr(e.target.value))} />
              </div>
            </div>
          </section>

          {/* Görseller */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Görseller</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Thumb Görsel URL</label>
                <input className={inputCls} value={form.thumbImage}
                  onChange={e => set('thumbImage', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Galeri Görselleri <span className="font-normal opacity-60">(her satır bir URL)</span></label>
                <textarea className={`${inputCls} resize-none font-mono text-xs`} rows={4}
                  value={arrToText(form.images)}
                  onChange={e => set('images', textToArr(e.target.value))} />
              </div>
            </div>
          </section>

          {/* Varyantlar */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Varyantlar</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Renkler <span className="font-normal opacity-60">(her satır bir renk)</span></label>
                <textarea className={`${inputCls} resize-none`} rows={4}
                  value={arrToText(form.colors)}
                  onChange={e => set('colors', textToArr(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Bedenler <span className="font-normal opacity-60">(her satır bir beden)</span></label>
                <textarea className={`${inputCls} resize-none`} rows={4}
                  value={arrToText(form.sizes)}
                  onChange={e => set('sizes', textToArr(e.target.value))} />
              </div>
            </div>
          </section>

          {/* Tedarikçi */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#06b6d4] mb-4">Tedarikçi Notu</h3>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Tedarikçi</label>
                <input className={inputCls} value={form.supplier}
                  onChange={e => set('supplier', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Tedarikçi Notu</label>
                <textarea className={`${inputCls} resize-none`} rows={2} value={form.supplierNote}
                  onChange={e => set('supplierNote', e.target.value)} />
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 px-6 py-4 bg-[#060f12] border-t border-white/[0.06] flex items-center gap-3">
          {error && <p className="text-xs text-red-400 flex-1">{error}</p>}
          {saved && !error && <p className="text-xs text-green-400 flex-1">✓ Kaydedildi</p>}
          {!error && !saved && <div className="flex-1" />}
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-white/10 text-sm text-[#7ecad6] hover:text-white hover:border-white/30 transition-colors">
            İptal
          </button>
          <button onClick={save} disabled={saving}
            className="px-8 py-2.5 rounded-full btn-brand text-sm font-bold disabled:opacity-40">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}

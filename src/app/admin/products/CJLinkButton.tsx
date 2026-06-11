'use client'

import { useState } from 'react'

type CJVariant = { vid: string; variantNameEn: string; variantSellPrice: number; variantKey: string; variantImage: string }
type CJSearchResult = { pid: string; productNameEn: string; productImage: string; sellPrice: string }
type CJDetail = CJSearchResult & { variants: CJVariant[] }

export function CJLinkButton({
  productId,
  initialVariantId,
}: {
  productId: string
  initialVariantId: string | null
}) {
  const [linked,        setLinked]        = useState(initialVariantId)
  const [open,          setOpen]          = useState(false)
  const [query,         setQuery]         = useState('')
  const [results,       setResults]       = useState<CJSearchResult[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [expanded,      setExpanded]      = useState<string | null>(null)
  const [detail,        setDetail]        = useState<CJDetail | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [selected,      setSelected]      = useState<{ pid: string; vid: string } | null>(null)
  const [saving,        setSaving]        = useState(false)

  async function search() {
    if (!query.trim()) return
    setLoadingSearch(true)
    setResults([])
    setExpanded(null)
    setDetail(null)
    setSelected(null)
    try {
      const res = await fetch(`/api/admin/cj/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(Array.isArray(data) ? data : [])
    } finally {
      setLoadingSearch(false)
    }
  }

  async function loadDetail(pid: string) {
    if (expanded === pid) { setExpanded(null); setDetail(null); return }
    setExpanded(pid)
    setDetail(null)
    setLoadingDetail(true)
    try {
      const res = await fetch(`/api/admin/cj/detail?pid=${pid}`)
      const data = await res.json()
      setDetail(data)
    } finally {
      setLoadingDetail(false)
    }
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    try {
      await fetch('/api/admin/cj/link', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, cjProductId: selected.pid, cjVariantId: selected.vid }),
      })
      setLinked(selected.vid)
      setOpen(false)
      setSelected(null)
    } finally {
      setSaving(false)
    }
  }

  async function unlink() {
    setSaving(true)
    try {
      await fetch('/api/admin/cj/link', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, cjProductId: null, cjVariantId: null }),
      })
      setLinked(null)
    } finally {
      setSaving(false)
    }
  }

  function closeModal() {
    setOpen(false)
    setQuery('')
    setResults([])
    setExpanded(null)
    setDetail(null)
    setSelected(null)
  }

  return (
    <>
      {linked ? (
        <div className="flex flex-col items-center gap-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
            CJ Bağlı
          </span>
          <button onClick={unlink} disabled={saving}
            className="text-[10px] text-[#7ecad6] hover:text-red-400 transition-colors">
            Kaldır
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#06b6d4]/30
            text-[#06b6d4] hover:bg-[rgba(6,182,212,0.1)] transition-colors"
        >
          + CJ Bağla
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-[rgba(6,182,212,0.2)] bg-[#060f12] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg">CJ Ürün Bağla</h3>
              <button onClick={closeModal} className="text-[#7ecad6] hover:text-white text-2xl leading-none">×</button>
            </div>

            {/* Arama */}
            <div className="flex gap-2 mb-4">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="İngilizce ara (ör: automatic pet feeder)..."
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:border-[#06b6d4]/50 placeholder-[#4a7a86]"
              />
              <button onClick={search} disabled={loadingSearch}
                className="px-4 py-2.5 rounded-xl bg-[#06b6d4] text-black font-bold text-sm hover:opacity-80 disabled:opacity-50 min-w-[60px]">
                {loadingSearch ? '...' : 'Ara'}
              </button>
            </div>

            {/* Sonuçlar */}
            {results.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-[#7ecad6] mb-2">Ürüne tıkla → varyantları gör → seç → Bağla</p>
                {results.map(p => (
                  <div key={p.pid} className="rounded-xl border border-white/[0.06] overflow-hidden">
                    {/* Ürün satırı */}
                    <button
                      onClick={() => loadDetail(p.pid)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-white/[0.04] transition-colors text-left"
                    >
                      {p.productImage && (
                        <img src={p.productImage} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{p.productNameEn}</p>
                        <p className="text-[10px] text-[#7ecad6]">Başlangıç: ${p.sellPrice}</p>
                      </div>
                      <span className="text-[#7ecad6] text-lg flex-shrink-0">
                        {expanded === p.pid ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Varyantlar */}
                    {expanded === p.pid && (
                      <div className="border-t border-white/[0.06] p-3 bg-white/[0.02]">
                        {loadingDetail ? (
                          <p className="text-xs text-[#7ecad6] text-center py-2">Yükleniyor...</p>
                        ) : detail?.variants?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {detail.variants.map(v => (
                              <button
                                key={v.vid}
                                onClick={() => setSelected({ pid: p.pid, vid: v.vid })}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                                  selected?.vid === v.vid
                                    ? 'border-[#06b6d4] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                                    : 'border-white/[0.1] bg-white/[0.04] text-[#7ecad6] hover:border-white/30'
                                }`}
                              >
                                {v.variantImage && (
                                  <img src={v.variantImage} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                                )}
                                <div>
                                  <div>{v.variantKey || v.variantNameEn}</div>
                                  <div className="text-[10px] opacity-70">${v.variantSellPrice}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#7ecad6] text-center py-2">Varyant bulunamadı</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Bağla butonu */}
            {selected && (
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-xs text-[#7ecad6]">Seçili VID: <span className="text-[#06b6d4] font-mono">{selected.vid}</span></p>
                <button onClick={save} disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#06b6d4] text-black font-bold text-sm hover:opacity-80 disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Bağla'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

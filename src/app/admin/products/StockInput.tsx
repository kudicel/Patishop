'use client'

import { useState, useRef } from 'react'

const LOW_STOCK = 10

export function StockInput({ productId, initial }: { productId: string; initial: number }) {
  const [stock,   setStock]   = useState(initial)
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState(String(initial))
  const [saving,  setSaving]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(String(stock))
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function save() {
    const val = parseInt(draft, 10)
    if (isNaN(val) || val < 0) { setEditing(false); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, stock: val }),
      })
      if (res.ok) setStock(val)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') save()
    if (e.key === 'Escape') setEditing(false)
  }

  const color = stock === 0
    ? 'text-red-400'
    : stock <= LOW_STOCK
      ? 'text-yellow-400'
      : 'text-green-400'

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={e => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={save}
        onKeyDown={onKey}
        disabled={saving}
        className="w-20 bg-white/[0.08] border border-[#ff9a3c]/40 rounded-lg px-2 py-1
          text-sm text-center font-mono focus:outline-none focus:border-[#ff9a3c]"
        autoFocus
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      title="Düzenlemek için tıkla"
      className={`font-mono font-bold text-sm ${color}
        hover:opacity-70 transition-opacity cursor-pointer px-2 py-1
        rounded-lg hover:bg-white/[0.05]`}
    >
      {stock}
    </button>
  )
}

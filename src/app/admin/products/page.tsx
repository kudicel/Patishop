import { prisma } from '@/lib/prisma'
import { PRODUCTS } from '@/lib/products'
import { formatPrice } from '@/lib/locale'
import { StockInput } from './StockInput'

const CATEGORY_LABELS: Record<string, string> = {
  'mama-kabi':       'Mama Kabı',
  'kum-temizleyici': 'Kum Temizleyici',
  'tasma':           'Tasma',
  'oyuncak':         'Oyuncak',
  'kiyafet':         'Kıyafet',
  'yatak':           'Yatak',
}

const LOW_STOCK = 10

export default async function AdminProductsPage() {
  const dbRows = await prisma.product.findMany()
  const stockMap = Object.fromEntries(dbRows.map(r => [r.id, r.stock]))

  const products = PRODUCTS.map(p => ({
    ...p,
    stock: stockMap[p.id] ?? 50,
  }))

  const totalStock   = products.reduce((s, p) => s + p.stock, 0)
  const lowCount     = products.filter(p => p.stock > 0 && p.stock <= LOW_STOCK).length
  const outCount     = products.filter(p => p.stock === 0).length

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-black mb-1">Ürünler</h1>
      <p className="text-[#c4a896] text-sm mb-8">
        {products.length} ürün · Stok rakamına tıkla → düzenle
      </p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-500/20 to-blue-600/5 p-5">
          <div className="text-2xl mb-2">📦</div>
          <div className="text-2xl font-black">{totalStock}</div>
          <div className="text-xs text-[#c4a896] mt-1">Toplam Stok</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 p-5">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-2xl font-black">{lowCount}</div>
          <div className="text-xs text-[#c4a896] mt-1">Düşük Stok (≤{LOW_STOCK})</div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-red-500/20 to-red-600/5 p-5">
          <div className="text-2xl mb-2">🚫</div>
          <div className="text-2xl font-black">{outCount}</div>
          <div className="text-xs text-[#c4a896] mt-1">Tükendi</div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#c4a896] text-xs uppercase tracking-wide border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-6 py-3 text-left">Ürün</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-right">Fiyat</th>
                <th className="px-6 py-3 text-center">Puan</th>
                <th className="px-6 py-3 text-center">Stok</th>
                <th className="px-6 py-3 text-center">Durum</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const status = p.stock === 0
                  ? { label: 'Tükendi',    cls: 'bg-red-500/10 text-red-400 border-red-500/20' }
                  : p.stock <= LOW_STOCK
                    ? { label: 'Az Kaldı', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
                    : { label: 'Stokta',   cls: 'bg-green-500/10 text-green-400 border-green-500/20' }

                return (
                  <tr key={p.id}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3">
                      <div className="font-semibold text-white">{p.name}</div>
                      {p.badge && (
                        <span className="text-[10px] text-[#ff9a3c] font-bold uppercase">{p.badge}</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-[#c4a896]">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold">
                      {formatPrice(p.price, 'TR')}
                    </td>
                    <td className="px-6 py-3 text-center text-[#c4a896]">
                      ★ {p.rating} <span className="text-xs">({p.reviewCount})</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <StockInput productId={p.id} initial={p.stock} />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-[#c4a896] mt-4 text-center">
        Stok alanına tıklayıp yeni değeri yaz → Enter ile kaydet
      </p>
    </div>
  )
}

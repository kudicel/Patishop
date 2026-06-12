import Link from 'next/link'
import { getProducts } from '@/lib/db-products'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'

interface Props { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const query = q.trim().toLowerCase()

  const allProducts = await getProducts()
  const results = query
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.shortDesc.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query)
      )
    : []

  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-white">Arama</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">
            {query ? `"${q}" için sonuçlar` : 'Ürün Ara'}
          </h1>
          {query && (
            <p className="text-[#7ecad6]">
              {results.length > 0 ? `${results.length} ürün bulundu` : 'Sonuç bulunamadı'}
            </p>
          )}
        </div>

        {query && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#7ecad6] text-lg mb-4">"{q}" ile eşleşen ürün bulunamadı.</p>
            <Link href="/#products" className="btn-brand px-6 py-3 rounded-full font-bold">
              Tüm Ürünleri Gör
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

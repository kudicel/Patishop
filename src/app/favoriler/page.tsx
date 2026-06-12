'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductCard } from '@/components/ProductCard'
import { useEffect, useState } from 'react'
import type { Product } from '@/types'

export default function FavorilerPage() {
  const wishlist = useStore(s => s.wishlist)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length === 0) { setLoading(false); return }
    fetch('/api/products')
      .then(r => r.json())
      .then((all: Product[]) => {
        setProducts(all.filter(p => wishlist.includes(p.id)))
        setLoading(false)
      })
  }, [wishlist])

  return (
    <>
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-white">Favorilerim</span>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Favorilerim</h1>
          {!loading && (
            <p className="text-[#7ecad6]">{products.length} ürün kaydedildi</p>
          )}
        </div>

        {loading ? (
          <p className="text-[#7ecad6] py-20 text-center">Yükleniyor...</p>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7ecad6] text-lg mb-4">Henüz favori ürün eklemediniz.</p>
            <Link href="/#products" className="btn-brand px-6 py-3 rounded-full font-bold">
              Ürünleri Keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

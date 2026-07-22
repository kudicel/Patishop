import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProducts, getProductById } from '@/lib/db-products'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/AddToCartButton'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ProductReviews } from '@/components/ProductReviews'
import { ImageGallery } from '@/components/ImageGallery'

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return {}
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const url  = `${base}/products/${id}`
  return {
    title: product.name,
    description: product.shortDesc,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: `${product.name} | PatiShop`,
      description: product.shortDesc,
      images: [{ url: product.images[0], width: 800, height: 600, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | PatiShop`,
      description: product.shortDesc,
      images: [product.images[0]],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const [product, allProducts] = await Promise.all([getProductById(id), getProducts()])
  if (!product) notFound()

  const related  = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3)
  const base     = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const isPetMedikal = (product.category as string) === 'pet-medikal'

  const approvedReviews = await prisma.review.findMany({
    where: { productId: id, approved: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${base}/products/${id}`,
    brand: { '@type': 'Brand', name: 'PatiShop' },
    ...(product.reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    } : {}),
    ...(approvedReviews.length > 0 ? {
      review: approvedReviews.map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.name },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        reviewBody: r.comment,
        datePublished: r.createdAt.toISOString(),
      })),
    } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: product.price.toFixed(2),
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${base}/products/${id}`,
      seller: { '@type': 'Organization', name: 'PatiShop' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: base },
      { '@type': 'ListItem', position: 2, name: 'Ürünler', item: `${base}/#products` },
      { '@type': 'ListItem', position: 3, name: product.categoryLabel, item: `${base}/kategori/${product.category}` },
      { '@type': 'ListItem', position: 4, name: product.name, item: `${base}/products/${id}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="px-6 lg:px-12 py-12 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#c4a896] mb-10">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-white transition-colors">Ürünler</Link>
          <span>/</span>
          <Link href={`/kategori/${product.category}`} className="hover:text-white transition-colors">
            {product.categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-[#fff8f4]">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div className="relative">
            <ImageGallery images={product.images} name={product.name} />
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 text-xs font-extrabold uppercase tracking-wide px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff9a3c] to-[#ff6b9d] text-white pointer-events-none">
                {product.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <Link href={`/kategori/${product.category}`}
                className="text-xs font-bold uppercase tracking-wider text-[#ff9a3c] hover:underline">
                {product.categoryLabel}
              </Link>
              <h1 className="text-4xl font-black mt-1 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-400 text-lg">
                  {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
                </span>
                <strong>{product.rating}</strong>
                <span className="text-[#c4a896]">({product.reviewCount} yorum)</span>
              </div>
              {product.stock === 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full w-fit mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  Tükendi
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full w-fit mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                  Son {product.stock} adet kaldı!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full w-fit mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Stokta
                </span>
              )}
            </div>

            <p className="text-[#c4a896] leading-relaxed">{product.description}</p>

            <ul className="space-y-2">
              {product.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#c4a896]">
                  <span className="text-[#ff9a3c] flex-shrink-0 mt-0.5">✓</span>{f}
                </li>
              ))}
            </ul>

            {/* Client-side cart + variant selector */}
            <AddToCartButton product={product} />

            {/* Pet Medikal güven notu */}
            {isPetMedikal && (
              <div className="rounded-2xl border border-[rgba(6,182,212,0.2)] bg-[rgba(6,182,212,0.06)] p-4 flex items-start gap-2.5">
                <span className="text-[#06b6d4] mt-0.5">🛡️</span>
                <p className="text-sm text-[#7ecad6]">
                  <strong className="text-white">Güvenli Kullanım Notu:</strong> Bu ürün, evcil hayvanınızın iyileşme ve bakım sürecinde güvenli kullanım gözetilerek seçilmiştir. Kullanmadan önce ürün açıklamasını inceleyin, ciddi sağlık durumlarında veteriner hekiminize danışın.
                </p>
              </div>
            )}

            {/* Kargo bilgisi */}
            <div className="rounded-2xl border border-[rgba(6,182,212,0.12)] bg-[rgba(6,182,212,0.04)] p-5 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-[#7ecad6]">
                <span>🚚</span>
                <span><strong className="text-white">20-25 gün</strong> teslimat · 17 ülkeye gönderim</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#7ecad6]">
                <span>📦</span>
                <span>Kargo ücreti <strong className="text-[#06b6d4]">fiyata dahil</strong> · 3.000₺ üzeri siparişlerde <strong className="text-white">%10 gümrük tahmini</strong> eklenir</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#7ecad6]">
                <span>✅</span>
                <span>ISO sertifikalı Çin fabrikası, güvenli paketleme</span>
              </div>
            </div>

            {/* Supplier */}
            <div className="rounded-2xl border border-[rgba(255,154,60,0.12)] bg-[rgba(255,154,60,0.04)] p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#ff9a3c] mb-1">Tedarikçi</p>
              <p className="text-[#c4a896] text-sm">{product.supplier}</p>
              <p className="text-[#c4a896] text-xs mt-1">{product.supplierNote}</p>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-black mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(p => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="group rounded-[2rem] border border-[rgba(255,154,60,0.12)] bg-[rgba(28,16,6,0.96)] overflow-hidden hover:border-[rgba(255,154,60,0.3)] hover:-translate-y-1 transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image src={p.thumbImage} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="33vw"/>
                  </div>
                  <div className="p-4">
                    <p className="font-bold">{p.name}</p>
                    <p className="text-[#c4a896] text-xs mt-1">{p.shortDesc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getProducts } from '@/lib/db-products'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { SortableProductGrid } from '@/components/SortableProductGrid'

interface Props { params: Promise<{ slug: string }> }

const CATEGORY_META: Record<string, {
  label: string
  labelEn: string
  description: string
}> = {
  'mama-kabi': {
    label: 'Mama Kapları',
    labelEn: 'Food Bowls',
    description: 'Akıllı ve WiFi kontrollü otomatik mama kapları. ISO sertifikalı, 17 ülkeye hızlı teslimat.',
  },
  'kum-temizleyici': {
    label: 'Kum Temizleyiciler',
    labelEn: 'Litter Cleaners',
    description: 'Sessiz çalışan otomatik kedi kumu temizleyiciler. Akıllı sensörlü, kolay temizlik.',
  },
  'tasma': {
    label: 'Tasma & Aksesuar',
    labelEn: 'Leashes & Accessories',
    description: 'Ergonomik tasma setleri ve aksesuar koleksiyonu. Her ırk ve beden için uygun.',
  },
  'oyuncak': {
    label: 'Oyuncaklar',
    labelEn: 'Toys',
    description: 'Kedi ve köpekler için interaktif oyuncaklar. Lazerli, sesli ve hareketli modeller.',
  },
  'kiyafet': {
    label: 'Kıyafetler',
    labelEn: 'Clothing',
    description: 'Sevimli ve şık kedi & köpek kıyafetleri. Tüm sezonlar için model çeşitliliği.',
  },
  'yatak': {
    label: 'Yataklar',
    labelEn: 'Beds',
    description: 'Ortopedik ve lüks evcil hayvan yatakları. Yumuşak, yıkanabilir, dayanıklı.',
  },
  'tasima-cantasi': {
    label: 'Taşıma Çantaları',
    labelEn: 'Carrier Bags',
    description: 'Kedi ve köpekler için güvenli ve konforlu taşıma çantaları. Havayolu onaylı, nefes alabilen modeller.',
  },
  'diger-aksesuar': {
    label: 'Diğer Aksesuarlar',
    labelEn: 'Other Accessories',
    description: 'Tımar fırçaları, tırnak makaları, bandanalar ve daha fazlası. Evcil hayvan bakımı için her şey.',
  },
  'pet-medikal': {
    label: 'Pet Medikal & Güvenlik',
    labelEn: 'Pet Medical & Safety',
    description: 'E-collar, koruyucu koni, ameliyat sonrası tulum, bandaj ve güvenlik ürünleri. Evcil hayvanınızın iyileşme sürecini destekleyin.',
  },
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) return {}
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const url  = `${base}/kategori/${slug}`
  return {
    title: `${meta.label} — Evcil Hayvan Aksesuarları`,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type:        'website',
      url,
      title:       `${meta.label} | PatiShop`,
      description: meta.description,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug }   = await params
  const meta       = CATEGORY_META[slug]
  if (!meta) notFound()

  const allProducts = await getProducts()
  const products    = allProducts.filter(p => p.category === slug)
  const base        = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ItemList',
    name:       meta.label,
    url:        `${base}/kategori/${slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      url:       `${base}/products/${p.id}`,
      name:      p.name,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: base },
      { '@type': 'ListItem', position: 2, name: 'Ürünler', item: `${base}/#products` },
      { '@type': 'ListItem', position: 3, name: meta.label, item: `${base}/kategori/${slug}` },
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
        <nav className="flex items-center gap-2 text-sm text-[#7ecad6] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/#products" className="hover:text-white transition-colors">Ürünler</Link>
          <span>/</span>
          <span className="text-white">{meta.label}</span>
        </nav>

        {/* Başlık */}
        <div className="mb-10">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#06b6d4] mb-3">
            Kategori
          </span>
          <h1 className="text-4xl font-black mb-3">{meta.label}</h1>
          <p className="text-[#7ecad6] max-w-2xl leading-relaxed">{meta.description}</p>
        </div>

        {/* Diğer kategorilere linkler */}
        <div className="flex flex-wrap gap-2 mb-10">
          {Object.entries(CATEGORY_META).map(([s, m]) => (
            <Link
              key={s}
              href={`/kategori/${s}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all ${
                s === slug
                  ? 'border-[rgba(6,182,212,0.5)] bg-[rgba(6,182,212,0.15)] text-[#06b6d4]'
                  : 'border-white/10 bg-white/5 text-[#7ecad6] hover:border-[rgba(6,182,212,0.3)] hover:text-white'
              }`}
            >
              {m.label}
            </Link>
          ))}
        </div>

        {/* Ürün grid */}
        {products.length === 0 ? (
          <p className="text-center text-[#7ecad6] py-20">Bu kategoride henüz ürün yok.</p>
        ) : (
          <SortableProductGrid products={products} />
        )}
      </main>
      <Footer />
    </>
  )
}

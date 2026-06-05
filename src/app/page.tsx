import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedPanels } from '@/components/FeaturedPanels'
import { ProductsSection } from '@/components/ProductsSection'
import { ReviewsSection } from '@/components/ReviewsSection'
import { SuppliersSection } from '@/components/SuppliersSection'
import { AnalyticsSection } from '@/components/AnalyticsSection'
import { Footer } from '@/components/Footer'
import { PRODUCTS } from '@/lib/products'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedPanels />
        <ProductsSection products={PRODUCTS} />
        <ReviewsSection />
        <SuppliersSection />
        <AnalyticsSection />
      </main>
      <Footer />
    </>
  )
}

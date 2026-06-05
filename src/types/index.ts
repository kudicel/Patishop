export type Category = 'mama-kabi' | 'kum-temizleyici' | 'tasma' | 'oyuncak' | 'kiyafet' | 'yatak'

export interface Product {
  id: string
  name: string
  category: Category
  categoryLabel: string
  price: number // TRY base
  rating: number
  reviewCount: number
  badge?: string
  images: string[]
  thumbImage: string
  shortDesc: string
  description: string
  features: string[]
  colors?: string[]
  sizes?: string[]
  supplier: string
  supplierNote: string
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface Country {
  name: string
  flag: string
  lang: string
  intlLocale: string
  currency: string
  rate: number
  decimals: number
}

export interface ShippingMethod {
  id: 'standard' | 'express'
  priceTRY: number
}

export interface Order {
  id: string
  items: CartItem[]
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  shipping: ShippingMethod
  subtotalTRY: number
  totalTRY: number
  createdAt: string
}

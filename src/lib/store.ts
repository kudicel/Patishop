'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface AppStore {
  // Locale
  currentCountry: string
  setCountry: (code: string) => void

  // Cart
  cart: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, qty?: number, color?: string, size?: string) => void
  removeFromCart: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isWishlisted: (productId: string) => boolean

  // Modal
  modalProductId: string | null
  openModal: (id: string) => void
  closeModal: () => void
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Locale
      currentCountry: 'TR',
      setCountry: (code) => set({ currentCountry: code }),

      // Cart
      cart: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      addToCart: (product, qty = 1, color, size) => {
        const { cart } = get()
        const key = `${product.id}-${color ?? ''}-${size ?? ''}`
        const existing = cart.find(
          i => `${i.product.id}-${i.selectedColor ?? ''}-${i.selectedSize ?? ''}` === key
        )
        if (existing) {
          set({ cart: cart.map(i =>
            `${i.product.id}-${i.selectedColor ?? ''}-${i.selectedSize ?? ''}` === key
              ? { ...i, quantity: i.quantity + qty }
              : i
          ), cartOpen: true })
        } else {
          set({ cart: [...cart, { product, quantity: qty, selectedColor: color, selectedSize: size }], cartOpen: true })
        }
      },

      removeFromCart: (productId) =>
        set({ cart: get().cart.filter(i => i.product.id !== productId) }),

      updateQty: (productId, qty) =>
        set({ cart: get().cart
          .map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
          .filter(i => i.quantity > 0)
        }),

      clearCart: () => set({ cart: [] }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get()
        set({ wishlist: wishlist.includes(productId)
          ? wishlist.filter(id => id !== productId)
          : [...wishlist, productId]
        })
      },
      isWishlisted: (productId) => get().wishlist.includes(productId),

      // Modal
      modalProductId: null,
      openModal: (id) => set({ modalProductId: id }),
      closeModal: () => set({ modalProductId: null }),
    }),
    {
      name: 'patishop',
      partialize: (s) => ({ cart: s.cart, currentCountry: s.currentCountry, wishlist: s.wishlist }),
    }
  )
)

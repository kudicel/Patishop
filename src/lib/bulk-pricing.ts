export const BULK_TIERS = [
  { minQty: 1,   maxQty: 10,       discount: 0,     label: '1–10 adet'    },
  { minQty: 11,  maxQty: 49,       discount: 0.05,  label: '11–49 adet'   },
  { minQty: 50,  maxQty: 99,       discount: 0.075, label: '50–99 adet'   },
  { minQty: 100, maxQty: 199,      discount: 0.10,  label: '100–199 adet' },
  { minQty: 200, maxQty: Infinity, discount: 0.125, label: '200+ adet'    },
]

export function getTier(qty: number) {
  return BULK_TIERS.find(t => qty >= t.minQty && qty <= t.maxQty) ?? BULK_TIERS[0]
}

export function bulkUnitPrice(basePrice: number, qty: number): number {
  const { discount } = getTier(qty)
  return Math.round(basePrice * (1 - discount))
}

export function bulkLineTotal(basePrice: number, qty: number): number {
  return bulkUnitPrice(basePrice, qty) * qty
}

export function discountLabel(discount: number): string {
  if (discount === 0) return ''
  const pct = discount * 100
  const str = pct % 1 === 0 ? pct.toString() : pct.toFixed(1).replace('.', ',')
  return `-%${str}`
}

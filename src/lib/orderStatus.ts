export const ORDER_STATUSES = [
  { value: 'awaiting_payment', label: 'Ödeme Bekleniyor', cls: 'bg-orange-500/15 text-orange-400 border border-orange-500/25' },
  { value: 'pending',          label: 'Beklemede',        cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25' },
  { value: 'processing',       label: 'İşlemde',          cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/25' },
  { value: 'shipped',          label: 'Kargoda',          cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/25' },
  { value: 'delivered',        label: 'Teslim Edildi',    cls: 'bg-green-500/15 text-green-400 border border-green-500/25' },
  { value: 'cancelled',        label: 'İptal',            cls: 'bg-red-500/15 text-red-400 border border-red-500/25' },
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]['value']

export function statusLabel(status: string): string {
  return ORDER_STATUSES.find(s => s.value === status)?.label ?? status
}

export function statusClass(status: string): string {
  return ORDER_STATUSES.find(s => s.value === status)?.cls ?? 'bg-white/10 text-white'
}

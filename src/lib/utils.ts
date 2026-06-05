export const BADGE_CLASSES: Record<string, string> = {
  'Çok Satan':    'bg-gradient-to-r from-accent to-accent-2 text-white',
  'Yeni':         'bg-gradient-to-r from-violet-500 to-blue-500 text-white',
  'Premium':      'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
  'En İyi Değer': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
  'Bütçe Dostu':  'bg-gradient-to-r from-cyan-500 to-teal-600 text-white',
  'Yeni Sezon':   'bg-gradient-to-r from-pink-500 to-rose-600 text-white',
}

export function badgeClass(badge: string): string {
  return BADGE_CLASSES[badge] ?? 'bg-white/10 text-white'
}

export function stars(rating: number): string {
  const full  = Math.round(rating)
  const empty = 5 - full
  return '★'.repeat(full) + '☆'.repeat(empty)
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

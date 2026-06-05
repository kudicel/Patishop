'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin',           label: 'Dashboard',   icon: '▣' },
  { href: '/admin/orders',    label: 'Siparişler',  icon: '📦' },
  { href: '/admin/customers', label: 'Müşteriler',  icon: '👥' },
]

export function AdminNav({ userName }: { userName: string }) {
  const path = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return path === '/admin'
    return path.startsWith(href)
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-[rgba(255,255,255,0.02)] border-r border-white/[0.06]
      flex flex-col min-h-screen sticky top-0">

      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <Link href="/" className="brand-gradient text-xl font-black tracking-tight block">
          PatiShop
        </Link>
        <span className="text-[10px] text-[#c4a896] mt-0.5 block uppercase tracking-widest">
          Admin Paneli
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive(l.href)
                ? 'bg-[rgba(255,154,60,0.12)] text-[#ff9a3c] border border-[rgba(255,154,60,0.2)]'
                : 'text-[#c4a896] hover:bg-white/[0.05] hover:text-white'}`}
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/[0.06] space-y-2">
        <p className="text-xs text-[#c4a896] truncate">{userName}</p>
        <div className="flex gap-2">
          <Link href="/" className="text-xs text-[#c4a896] hover:text-white transition-colors">
            ← Mağaza
          </Link>
          <span className="text-white/20">·</span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-xs text-[#c4a896] hover:text-red-400 transition-colors"
          >
            Çıkış
          </button>
        </div>
      </div>
    </aside>
  )
}

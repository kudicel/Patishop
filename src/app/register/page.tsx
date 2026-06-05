'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', password: '', password2: '', terms: false,
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) {
      setError('Lütfen tüm alanları doldurun.'); return
    }
    if (form.password !== form.password2) {
      setError('Şifreler eşleşmiyor.'); return
    }
    if (form.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.'); return
    }
    if (!form.terms) {
      setError('Kullanım şartlarını kabul etmelisiniz.'); return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     form.name,
        email:    form.email,
        password: form.password,
      }),
    })

    if (!res.ok) {
      const data = await res.json() as { error?: string }
      setError(data.error ?? 'Kayıt başarısız.')
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      email:    form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Kayıt başarılı ancak giriş yapılamadı. Lütfen giriş sayfasına gidin.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="brand-gradient text-3xl font-black tracking-tight mb-2">
        PatiShop
      </Link>
      <p className="text-[#c4a896] text-sm mb-10">Yeni hesap oluştur, alışverişe başla</p>

      <div className="w-full max-w-md rounded-[2rem] border border-[rgba(255,154,60,0.12)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl font-black mb-2">Kaydol</h1>
        <p className="text-[#c4a896] text-sm mb-8 leading-relaxed">
          Hızlı kayıt ile hesabını oluştur ve premium evcil hayvan ürünlerine eriş.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name',      label: 'Ad Soyad',      type: 'text',     placeholder: 'Adınız Soyadınız' },
            { id: 'email',     label: 'E-posta',        type: 'email',    placeholder: 'ornek@eposta.com' },
            { id: 'password',  label: 'Şifre',          type: 'password', placeholder: 'En az 6 karakter' },
            { id: 'password2', label: 'Şifre Tekrar',   type: 'password', placeholder: 'Şifrenizi tekrar girin' },
          ].map(field => (
            <label key={field.id} className="block">
              <span className="text-sm font-semibold text-[#c4a896] block mb-1.5">{field.label}</span>
              <input
                type={field.type}
                required
                value={(form as unknown as Record<string, string>)[field.id]}
                onChange={e => set(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#fff8f4]
                  placeholder:text-white/30 focus:outline-none focus:border-[rgba(255,154,60,0.5)] transition-colors"
              />
            </label>
          ))}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.terms}
              onChange={e => set('terms', e.target.checked)}
              className="mt-1 accent-[#ff9a3c]"
            />
            <span className="text-sm text-[#c4a896] leading-relaxed">
              Kullanım Şartlarını ve Gizlilik Politikasını kabul ediyorum.
            </span>
          </label>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-brand w-full rounded-full py-3.5 font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
          </button>
        </form>

        <div className="flex justify-between mt-6 text-sm">
          <Link href="/login" className="text-[#ff9a3c] hover:underline">Zaten hesabın var mı? Giriş Yap</Link>
          <Link href="/" className="text-[#c4a896] hover:text-white transition-colors">Ana Sayfa</Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') ?? '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('E-posta veya şifre hatalı.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-[rgba(255,154,60,0.12)] bg-[rgba(255,255,255,0.04)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
      <h1 className="text-3xl font-black mb-2">Giriş Yap</h1>
      <p className="text-[#c4a896] text-sm mb-8 leading-relaxed">
        Hesabını yönetmek, sepetine erişmek ve özel tekliflerden yararlanmak için giriş yap.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-[#c4a896] block mb-1.5">E-posta</span>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#fff8f4]
              placeholder:text-white/30 focus:outline-none focus:border-[rgba(255,154,60,0.5)] transition-colors"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-[#c4a896] block mb-1.5">Şifre</span>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Şifrenizi girin"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#fff8f4]
              placeholder:text-white/30 focus:outline-none focus:border-[rgba(255,154,60,0.5)] transition-colors"
          />
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
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div className="flex justify-between mt-6 text-sm">
        <span className="text-[#c4a896]">Şifremi unuttum</span>
        <Link href="/register" className="text-[#ff9a3c] hover:underline">Kaydol</Link>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-[#c4a896] text-sm hover:text-white transition-colors">
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="brand-gradient text-3xl font-black tracking-tight mb-2">
        PatiShop
      </Link>
      <p className="text-[#c4a896] text-sm mb-10">Hesabına hızlıca giriş yap</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

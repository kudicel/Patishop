'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useStore } from '@/lib/store'
import { formatPrice, t, COUNTRIES } from '@/lib/locale'
import { bulkLineTotal } from '@/lib/bulk-pricing'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
}

type Errors = Partial<Record<keyof FormData, string>>

const LOGISTICS_RATE = 0.08

export default function CheckoutPage() {
  const router    = useRouter()
  const cart      = useStore(s => s.cart)
  const country   = useStore(s => s.currentCountry)
  const clearCart = useStore(s => s.clearCart)

  const [step, setStep]             = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [couponInput,    setCouponInput]    = useState('')
  const [couponApplied,  setCouponApplied]  = useState<{ code: string; discount: number } | null>(null)
  const [couponError,    setCouponError]    = useState('')
  const [couponChecking, setCouponChecking] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', zip: '',
    country: country,
  })
  const [errors, setErrors] = useState<Errors>({})

  // --- Fiyat hesaplamaları ---
  const subtotalTRY = cart.reduce((s, i) => s + bulkLineTotal(i.product.price, i.quantity), 0)
  const discountTRY = couponApplied?.discount ?? 0

  // Tedarikçi bazlı lojistik (%8)
  const supplierGroups = cart.reduce<Record<string, number>>((acc, item) => {
    const s = item.product.supplier
    acc[s] = (acc[s] ?? 0) + bulkLineTotal(item.product.price, item.quantity)
    return acc
  }, {})
  const logisticsLines = Object.entries(supplierGroups).map(([supplier, total]) => ({
    supplier,
    total,
    logistics: Math.round(total * LOGISTICS_RATE),
  }))
  const totalLogisticsTRY = logisticsLines.reduce((s, g) => s + g.logistics, 0)

  // KDV: TR = %20, yurt dışı = %0
  const kdvRate  = form.country === 'TR' ? 0.20 : 0
  const kdvBase  = subtotalTRY - discountTRY + totalLogisticsTRY
  const kdvTRY   = Math.round(kdvBase * kdvRate)
  const totalTRY = kdvBase + kdvTRY

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponChecking(true)
    setCouponError('')
    setCouponApplied(null)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotalTRY }),
      })
      const data = await res.json()
      if (!res.ok) { setCouponError(data.error); return }
      setCouponApplied({ code: data.code, discount: data.discount })
    } finally {
      setCouponChecking(false)
    }
  }

  const displayCountry = form.country || country

  function update(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validateStep(s: number): boolean {
    const errs: Errors = {}
    if (s === 0) {
      if (!form.firstName.trim()) errs.firstName = t(country, 'co_required')
      if (!form.lastName.trim())  errs.lastName  = t(country, 'co_required')
      if (!form.email.trim() || !form.email.includes('@')) errs.email = t(country, 'co_required')
      if (!form.phone.trim())     errs.phone     = t(country, 'co_required')
    }
    if (s === 1) {
      if (!form.address.trim()) errs.address = t(country, 'co_required')
      if (!form.city.trim())    errs.city    = t(country, 'co_required')
      if (!form.zip.trim())     errs.zip     = t(country, 'co_required')
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  async function placeOrder() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName:      form.firstName,
          lastName:       form.lastName,
          email:          form.email,
          phone:          form.phone,
          address:        form.address,
          city:           form.city,
          zip:            form.zip,
          country:        form.country,
          shippingMethod: 'logistics',
          shippingPrice:  totalLogisticsTRY,
          subtotal:       subtotalTRY,
          discount:       discountTRY,
          couponCode:     couponApplied?.code ?? undefined,
          total:          totalTRY,
          items:          cart,
          status:         'awaiting_payment',
        }),
      })
      if (!res.ok) throw new Error('API error')
      const { id } = await res.json() as { id: string }
      clearCart()

      const mode = process.env.NEXT_PUBLIC_PAYMENT_MODE
      const paymentPath =
        mode === 'paytr'  ? `/checkout/payment/paytr?orderId=${id}` :
        mode === 'mock'   ? `/checkout/payment/mock?orderId=${id}`  :
                            `/checkout/payment/iyzico?orderId=${id}`
      router.push(paymentPath)
    } catch {
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && step < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#7ecad6]">
        <p className="text-lg">{t(country, 'cart_empty')}</p>
        <Link href="/" className="btn-brand px-8 py-3 rounded-full font-bold text-sm">
          {t(country, 'co_continue')}
        </Link>
      </div>
    )
  }

  const steps = [t(country, 'co_step1'), t(country, 'co_step2'), t(country, 'co_step3')]

  return (
    <div className="min-h-screen bg-[#050f12] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-[#06b6d4] font-black text-xl tracking-tight">PatiShop</Link>
        <span className="text-white/20">/</span>
        <span className="text-sm text-[#7ecad6]">{t(country, 'co_title')}</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10 max-w-sm mx-auto lg:mx-0">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                  ${i <= step ? 'bg-[#06b6d4] text-black' : 'bg-white/10 text-[#7ecad6]'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-[10px] mt-1 whitespace-nowrap ${i === step ? 'text-white' : 'text-[#7ecad6]'}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${i < step ? 'bg-[#06b6d4]' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol: form */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 lg:p-8">

              {/* Step 0: Kişisel bilgiler */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold mb-6">{t(country, 'co_step1')}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t(country, 'co_firstname')} error={errors.firstName}>
                      <input className={input(!!errors.firstName)} value={form.firstName}
                        onChange={e => update('firstName', e.target.value)} />
                    </Field>
                    <Field label={t(country, 'co_lastname')} error={errors.lastName}>
                      <input className={input(!!errors.lastName)} value={form.lastName}
                        onChange={e => update('lastName', e.target.value)} />
                    </Field>
                  </div>
                  <Field label={t(country, 'co_email')} error={errors.email}>
                    <input type="email" className={input(!!errors.email)} value={form.email}
                      onChange={e => update('email', e.target.value)} />
                  </Field>
                  <Field label={t(country, 'co_phone')} error={errors.phone}>
                    <input type="tel" className={input(!!errors.phone)} value={form.phone}
                      onChange={e => update('phone', e.target.value)} />
                  </Field>
                </div>
              )}

              {/* Step 1: Adres */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold mb-6">{t(country, 'co_step2')}</h2>
                  <Field label={t(country, 'co_country')}>
                    <select className={input(false)} value={form.country}
                      onChange={e => update('country', e.target.value)}>
                      {Object.entries(COUNTRIES).map(([code, cfg]) => (
                        <option key={code} value={code}>{cfg.flag} {cfg.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={t(country, 'co_address')} error={errors.address}>
                    <input className={input(!!errors.address)} value={form.address}
                      onChange={e => update('address', e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label={t(country, 'co_city')} error={errors.city}>
                      <input className={input(!!errors.city)} value={form.city}
                        onChange={e => update('city', e.target.value)} />
                    </Field>
                    <Field label={t(country, 'co_zip')} error={errors.zip}>
                      <input className={input(!!errors.zip)} value={form.zip}
                        onChange={e => update('zip', e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}

              {/* Step 2: Lojistik özeti + onay */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold mb-6">{t(country, 'co_step3')}</h2>

                  {/* Lojistik dağılımı */}
                  <div className="rounded-xl border border-[rgba(6,182,212,0.15)] bg-[rgba(6,182,212,0.04)] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#06b6d4] mb-3">
                      Lojistik Dağılımı (%{Math.round(LOGISTICS_RATE * 100)})
                    </p>
                    <div className="space-y-2">
                      {logisticsLines.map(g => (
                        <div key={g.supplier} className="flex items-center justify-between text-sm">
                          <span className="text-[#7ecad6] truncate max-w-[65%]">{g.supplier}</span>
                          <span className="text-white font-semibold">
                            {formatPrice(g.logistics, displayCountry)}
                          </span>
                        </div>
                      ))}
                      {logisticsLines.length > 1 && (
                        <div className="flex justify-between text-sm pt-2 border-t border-white/[0.08] font-bold">
                          <span className="text-[#7ecad6]">Toplam Lojistik</span>
                          <span className="text-[#06b6d4]">{formatPrice(totalLogisticsTRY, displayCountry)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KDV bilgisi */}
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                    {kdvRate > 0 ? (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#7ecad6]">KDV (%{Math.round(kdvRate * 100)})</span>
                        <span className="text-white font-semibold">{formatPrice(kdvTRY, displayCountry)}</span>
                      </div>
                    ) : (
                      <p className="text-sm text-[#7ecad6]">
                        KDV: <span className="text-green-400 font-semibold">%0</span> — yurt dışı satış, ihracat faturası
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigasyon */}
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button onClick={() => setStep(s => s - 1)}
                    className="flex-1 py-3.5 rounded-full border border-white/15 text-sm font-bold hover:border-white/30 transition-colors">
                    {t(country, 'co_back')}
                  </button>
                )}
                {step < 2 ? (
                  <button onClick={nextStep}
                    className="flex-1 btn-brand rounded-full py-3.5 font-bold text-sm">
                    {t(country, 'co_next')}
                  </button>
                ) : (
                  <button onClick={placeOrder} disabled={submitting}
                    className="flex-1 btn-brand rounded-full py-3.5 font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? 'Ödemeye yönlendiriliyor...' : t(country, 'co_place_order')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sağ: sipariş özeti */}
          <div className="lg:w-[340px] flex-shrink-0">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sticky top-6">
              <h3 className="font-bold mb-4">{t(country, 'co_order_summary')}</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-xs text-[#7ecad6]">
                          {[item.selectedColor, item.selectedSize].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <p className="text-xs text-[#7ecad6]">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-[#06b6d4] flex-shrink-0">
                      {formatPrice(bulkLineTotal(item.product.price, item.quantity), displayCountry)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Kupon */}
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
                    <span className="text-green-400 text-xs font-bold">🎟 {couponApplied.code}</span>
                    <button onClick={() => { setCouponApplied(null); setCouponInput('') }}
                      className="text-white/40 hover:text-white text-xs">✕</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Kupon kodu"
                      className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#06b6d4]/60 transition-colors uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponChecking || !couponInput.trim()}
                      className="px-4 py-2 rounded-xl bg-[rgba(6,182,212,0.15)] text-[#06b6d4] text-sm font-bold border border-[rgba(6,182,212,0.25)] hover:bg-[rgba(6,182,212,0.25)] transition-colors disabled:opacity-40"
                    >
                      {couponChecking ? '...' : 'Uygula'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-400 mt-1.5">{couponError}</p>}
              </div>

              {/* Fiyat kırılımı */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7ecad6]">{t(country, 'co_subtotal')}</span>
                  <span>{formatPrice(subtotalTRY, displayCountry)}</span>
                </div>
                {discountTRY > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">İndirim ({couponApplied?.code})</span>
                    <span className="text-green-400 font-bold">−{formatPrice(discountTRY, displayCountry)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#7ecad6]">Lojistik</span>
                  <span>{formatPrice(totalLogisticsTRY, displayCountry)}</span>
                </div>
                {kdvRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7ecad6]">KDV (%{Math.round(kdvRate * 100)})</span>
                    <span>{formatPrice(kdvTRY, displayCountry)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t border-white/[0.06]">
                  <span>{t(country, 'co_total')}</span>
                  <span className="text-[#06b6d4] text-lg">{formatPrice(totalTRY, displayCountry)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#7ecad6] uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

function input(hasError: boolean) {
  return `w-full bg-white/[0.05] border ${hasError ? 'border-red-500/60' : 'border-white/[0.08]'}
    rounded-xl px-4 py-3 text-sm text-white placeholder-[#7ecad6]/50
    focus:outline-none focus:border-[#06b6d4]/60 transition-colors`
}

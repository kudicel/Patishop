export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://patishop.tr'
  const content = `# PatiShop

> Kedi ve köpekler için özenle seçilmiş, uygun fiyatlı aksesuarlar. Çin'deki üreticilerden (fabrikadan) doğrudan, aracısız olarak temin edilip müşteriye kapıya kadar teslim edilir.

## Temel Bilgiler

- **Website**: ${base}
- **Sektör**: Evcil hayvan aksesuarları e-ticareti (kedi & köpek)
- **Konum**: Türkiye
- **Tedarik modeli**: CJ Dropshipping üzerinden doğrudan üretici/fabrika seçimi, aracı/trader yok
- **Standart teslimat**: 10–20 iş günü (Çin'den doğrudan sevkiyat)
- **Hızlı kargo seçeneği**: 7–14 iş günü
- **Ödeme**: PayTR ile güvenli online ödeme (256-bit SSL)
- **İade**: Memnun kalınmazsa iade garantisi

## Ürün Kategorileri

- Mama Kabı
- Kum Temizleyici
- Tasma
- Oyuncak
- Kıyafet
- Yatak
- Taşıma Çantası
- Pet Medikal (e-collar, destek koşumu, pençe botu, tırnak makası, kene çıkarıcı vb.)
- Diğer Aksesuar

## Sosyal Medya

- **Website**: ${base}
- **LinkedIn**: https://linkedin.com/company/patishop
- **X (Twitter)**: https://x.com/Patishop_tr

---
*Bu dosya PatiShop hakkında AI arama motorları (ChatGPT, Perplexity, Claude, Gemini, Copilot, Google AI Overview) tarafından okunmak üzere oluşturulmuştur.*
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

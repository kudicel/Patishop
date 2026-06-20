const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS ?? 'info@patishop.tr'
const FROM_NAME  = 'PatiShop'

async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender:  { name: FROM_NAME, email: FROM_EMAIL },
      to:      [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
    }),
  })
}

export type OrderConfirmationItem = {
  productName:   string
  productPrice:  number
  quantity:      number
  selectedColor: string | null
  selectedSize:  string | null
}

export async function sendOrderConfirmationEmail(opts: {
  to:           string
  firstName:    string
  orderNumber:  string
  items:        OrderConfirmationItem[]
  subtotal:     number
  discount:     number
  couponCode:   string | null
  shippingPrice:number
  total:        number
  baseUrl:      string
}) {
  if (!process.env.BREVO_API_KEY) return

  const fmt = (n: number) =>
    new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n)

  const itemsHtml = opts.items.map(i => {
    const variant = [i.selectedColor, i.selectedSize].filter(Boolean).join(' / ')
    return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#1f2937">
          ${i.productName}${variant ? `<br><span style="color:#6b7280;font-size:12px">${variant}</span>` : ''}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:14px">×${i.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;font-size:14px;color:#1f2937">${fmt(i.productPrice * i.quantity)}</td>
      </tr>`
  }).join('')

  const discountRow = opts.discount > 0 ? `
    <tr>
      <td colspan="2" style="padding:6px 12px;font-size:13px;color:#059669">
        İndirim${opts.couponCode ? ` (${opts.couponCode})` : ''}
      </td>
      <td style="padding:6px 12px;text-align:right;font-size:13px;color:#059669;font-weight:600">−${fmt(opts.discount)}</td>
    </tr>` : ''

  const shippingRow = opts.shippingPrice > 0 ? `
    <tr>
      <td colspan="2" style="padding:6px 12px;font-size:13px;color:#6b7280">Lojistik</td>
      <td style="padding:6px 12px;text-align:right;font-size:13px;color:#6b7280">${fmt(opts.shippingPrice)}</td>
    </tr>` : ''

  await sendEmail({
    to:      opts.to,
    subject: `Siparişiniz Alındı — #${opts.orderNumber}`,
    html: `
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
        <div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">

          <!-- Header -->
          <div style="background:#050f12;padding:24px 32px;text-align:center">
            <span style="font-size:24px;font-weight:900;color:#06b6d4;letter-spacing:-0.5px">PatiShop</span>
          </div>

          <!-- Body -->
          <div style="padding:32px">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#111827">
              Siparişiniz Alındı! 🐾
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280">
              Merhaba <strong>${opts.firstName}</strong>, ödemeniz başarıyla alındı.
              Siparişiniz en kısa sürede hazırlanmaya başlanacak.
            </p>

            <!-- Order number badge -->
            <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:12px 16px;margin-bottom:24px;display:inline-block">
              <span style="font-size:12px;color:#0d9488;text-transform:uppercase;letter-spacing:1px;font-weight:600">Sipariş Numarası</span><br>
              <span style="font-size:18px;font-weight:900;color:#0f766e;letter-spacing:2px">#${opts.orderNumber}</span>
            </div>

            <!-- Items table -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
              <thead>
                <tr style="background:#f9fafb">
                  <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Ürün</th>
                  <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Adet</th>
                  <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600">Tutar</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Totals -->
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              ${discountRow}
              ${shippingRow}
              <tr style="border-top:2px solid #f3f4f6">
                <td colspan="2" style="padding:12px 12px 0;font-weight:700;font-size:15px;color:#111827">Toplam</td>
                <td style="padding:12px 12px 0;text-align:right;font-weight:900;font-size:18px;color:#06b6d4">${fmt(opts.total)}</td>
              </tr>
            </table>

            <!-- Delivery info -->
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;margin-bottom:24px;font-size:13px;color:#1e40af">
              🚚 <strong>Tahmini Teslimat:</strong> Siparişiniz 20–25 iş günü içinde adresinize ulaşacaktır.
              Kargoya verildiğinde ayrıca bilgilendirileceksiniz.
            </div>

            <!-- CTA -->
            <div style="text-align:center">
              <a href="${opts.baseUrl}/account/orders"
                style="display:inline-block;background:#06b6d4;color:#000000;font-weight:700;font-size:14px;padding:12px 28px;border-radius:100px;text-decoration:none">
                Siparişlerimi Görüntüle
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6">
            <p style="margin:0;font-size:12px;color:#9ca3af">
              Sorularınız için: <a href="mailto:destek@patishop.tr" style="color:#06b6d4;text-decoration:none">destek@patishop.tr</a>
            </p>
            <p style="margin:6px 0 0;font-size:11px;color:#d1d5db">© 2026 PatiShop. Tüm hakları saklıdır.</p>
          </div>

        </div>
      </body>
      </html>
    `,
  })
}

export type SupplierOrderItem = {
  productName:   string
  quantity:      number
  selectedColor: string | null
  selectedSize:  string | null
}

export async function sendSupplierOrderEmail(opts: {
  supplierName:  string
  supplierEmail: string
  orderNumber:   string
  customerName:  string
  address:       string
  city:          string
  country:       string
  shippingMethod:string
  items:         SupplierOrderItem[]
}) {
  if (!process.env.BREVO_API_KEY) return

  const itemsHtml = opts.items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${i.productName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${[i.selectedColor, i.selectedSize].filter(Boolean).join(', ') || '—'}</td>
    </tr>`
  ).join('')

  await sendEmail({
    to:      opts.supplierEmail,
    subject: `[PatiShop] Yeni Sipariş: ${opts.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#06b6d4">Yeni Sipariş Bildirimi</h2>
        <p>Merhaba <strong>${opts.supplierName}</strong>,</p>
        <p>PatiShop'tan yeni bir sipariş aldınız. Lütfen aşağıdaki ürünleri hazırlayın.</p>

        <h3 style="margin-top:24px">Sipariş: ${opts.orderNumber}</h3>
        <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:10px 12px;text-align:left">Ürün</th>
              <th style="padding:10px 12px;text-align:center">Adet</th>
              <th style="padding:10px 12px;text-align:left">Özellik</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <h3 style="margin-top:24px">Teslimat Adresi</h3>
        <p style="color:#374151">
          ${opts.customerName}<br>
          ${opts.address}, ${opts.city}<br>
          ${opts.country}
        </p>
        <p><strong>Kargo:</strong> ${opts.shippingMethod}</p>

        <hr style="margin:32px 0;border-color:#e5e7eb">
        <p style="color:#9ca3af;font-size:12px">Bu email PatiShop sipariş sistemi tarafından otomatik gönderilmiştir.</p>
      </div>
    `,
  })
}

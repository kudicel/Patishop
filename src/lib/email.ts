import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.EMAIL_FROM ?? 'PatiShop <onboarding@resend.dev>'

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
  if (!process.env.RESEND_API_KEY) return

  const itemsHtml = opts.items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${i.productName}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb">${[i.selectedColor, i.selectedSize].filter(Boolean).join(', ') || '—'}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from:    FROM,
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

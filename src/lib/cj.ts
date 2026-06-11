const CJ_BASE = process.env.CJ_API_BASE ?? 'https://developers.cjdropshipping.com/api2.0/v1'
const CJ_KEY  = process.env.CJ_API_KEY ?? ''

let cachedToken: string | null = null
let tokenExpiry = 0

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_KEY }),
  })
  const data = await res.json()
  if (!data.result) throw new Error(`CJ auth failed: ${data.message}`)

  cachedToken = data.data.accessToken
  tokenExpiry = Date.now() + 22 * 60 * 60 * 1000 // 22 saat (CJ token 24s geçerli)
  return cachedToken!
}

async function cjGet(path: string, params?: Record<string, string>) {
  const token = await getToken()
  const url = new URL(`${CJ_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    headers: { 'CJ-Access-Token': token },
  })
  return res.json()
}

async function cjPost(path: string, body: unknown) {
  const token = await getToken()
  const res = await fetch(`${CJ_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': token },
    body: JSON.stringify(body),
  })
  return res.json()
}

export type CJProduct = {
  pid: string
  productNameEn: string
  productImage: string
  variants: { vid: string; variantNameEn: string; variantSellPrice: number }[]
}

export async function searchCJProducts(keyword: string): Promise<CJProduct[]> {
  const data = await cjGet('/product/list', { productNameEn: keyword, pageNum: '1', pageSize: '20' })
  return data.data?.list ?? []
}

export async function getCJProductDetail(pid: string): Promise<CJProduct | null> {
  const data = await cjGet(`/product/query`, { pid })
  return data.data ?? null
}

export type CJOrderItem = {
  vid: string
  quantity: number
}

export type CJOrderAddress = {
  shippingCustomerName: string
  shippingPhone: string
  shippingCountryCode: string
  shippingProvince: string
  shippingCity: string
  shippingAddress: string
  shippingZip: string
}

export async function getCheapestLogistic(
  endCountryCode: string,
  items: CJOrderItem[],
): Promise<string | null> {
  const data = await cjPost('/logistic/freightCalculate', {
    startCountryCode: 'CN',
    endCountryCode,
    products: items.map(i => ({ vid: i.vid, quantity: i.quantity })),
  })
  const list: { logisticName: string; logisticPrice: number }[] = data.data ?? []
  if (!list.length) return null
  list.sort((a, b) => a.logisticPrice - b.logisticPrice)
  return list[0].logisticName
}

export async function createCJOrder(opts: {
  orderNumber: string
  items: CJOrderItem[]
  address: CJOrderAddress
  remark?: string
}): Promise<{ success: boolean; cjOrderId?: string; message?: string }> {
  const logisticName = await getCheapestLogistic(opts.address.shippingCountryCode, opts.items)
  if (!logisticName) {
    return { success: false, message: `${opts.address.shippingCountryCode} için uygun kargo seçeneği bulunamadı.` }
  }

  const data = await cjPost('/shopping/order/createOrder', {
    orderNumber: opts.orderNumber,
    fromCountryCode: 'CN',
    logisticName,
    shippingZip: opts.address.shippingZip,
    shippingCountryCode: opts.address.shippingCountryCode,
    shippingCountry: opts.address.shippingCountryCode,
    shippingProvince: opts.address.shippingProvince,
    shippingCity: opts.address.shippingCity,
    shippingAddress: opts.address.shippingAddress,
    shippingCustomerName: opts.address.shippingCustomerName,
    shippingPhone: opts.address.shippingPhone,
    remark: opts.remark ?? '',
    products: opts.items.map(i => ({ vid: i.vid, quantity: i.quantity })),
  })

  if (data.result && data.data) {
    const cjOrderId = typeof data.data === 'string' ? data.data : (data.data?.orderId ?? data.data?.orderNum)
    return { success: true, cjOrderId }
  }
  return { success: false, message: data.message ?? 'CJ sipariş oluşturulamadı' }
}

export async function getCJTrackInfo(cjOrderId: string) {
  const data = await cjGet('/logistic/trackInfo', { orderId: cjOrderId })
  return data.data ?? null
}

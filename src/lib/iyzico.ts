export interface IyzicoCheckoutFormResult {
  status: 'success' | 'failure'
  checkoutFormContent?: string
  token?: string
  tokenExpireTime?: number
  errorCode?: string
  errorMessage?: string
  errorGroup?: string
}

export interface IyzicoRetrieveResult {
  status: 'success' | 'failure'
  paymentStatus?: 'SUCCESS' | 'FAILURE' | 'INIT_THREEDS' | 'CALLBACK_THREEDS'
  paymentId?: string
  fraudStatus?: number
  errorCode?: string
  errorMessage?: string
}

function makeIyzipay() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Iyzipay = require('iyzipay')
  return new Iyzipay({
    apiKey:    process.env.IYZICO_API_KEY    ?? 'sandbox-placeholder',
    secretKey: process.env.IYZICO_SECRET_KEY ?? 'sandbox-placeholder',
    uri:       process.env.IYZICO_BASE_URL   ?? 'https://sandbox-api.iyzipay.com',
  })
}

export function initCheckoutForm(request: object): Promise<IyzicoCheckoutFormResult> {
  return new Promise((resolve, reject) => {
    const iyzipay = makeIyzipay()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iyzipay.checkoutFormInitialize.create(request, (err: any, result: IyzicoCheckoutFormResult) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

export function retrieveCheckoutForm(token: string): Promise<IyzicoRetrieveResult> {
  return new Promise((resolve, reject) => {
    const iyzipay = makeIyzipay()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iyzipay.checkoutFormResult.retrieve({ token }, (err: any, result: IyzicoRetrieveResult) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

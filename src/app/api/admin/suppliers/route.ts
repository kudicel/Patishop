import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email) return false
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  return user?.role === 'admin'
}

const PRESET_SUPPLIERS = [
  { name: 'PetTech Factory',    email: 'info@pettech-gz.cn',    country: 'CN', notes: 'Guangzhou — akıllı mama kapları, otomatik sistemler' },
  { name: 'PawTrend Yiwu',      email: 'sales@pawtrend-yw.cn',  country: 'CN', notes: 'Yiwu — tasmalar, kıyafetler, oyuncaklar, aksesuarlar' },
  { name: 'PetComfort Factory', email: 'order@petcomfort-nb.cn', country: 'CN', notes: 'Ningbo — lüks yataklar, konfor ürünleri' },
]

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })

  // İlk açılışta preset tedarikçileri otomatik ekle
  const count = await prisma.supplier.count()
  if (count === 0) {
    for (const s of PRESET_SUPPLIERS) {
      await prisma.supplier.create({ data: s })
    }
  }

  const suppliers = await prisma.supplier.findMany({ orderBy: { createdAt: 'asc' } })
  return NextResponse.json(suppliers)
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 })
  const body = await req.json()
  const supplier = await prisma.supplier.create({
    data: {
      name:       body.name,
      email:      body.email,
      phone:      body.phone || null,
      country:    body.country || 'CN',
      productIds: body.productIds || [],
      active:     body.active ?? true,
      notes:      body.notes || null,
    },
  })
  return NextResponse.json(supplier, { status: 201 })
}

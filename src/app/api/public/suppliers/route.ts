import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const suppliers = await prisma.supplier.findMany({
    where: { active: true },
    select: { name: true, productIds: true },
  })
  return NextResponse.json(suppliers)
}

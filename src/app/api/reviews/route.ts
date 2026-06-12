import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json([])

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest) {
  const { productId, name, rating, comment } = await req.json()

  if (!productId || !name || !rating || !comment) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Geçersiz puan' }, { status: 400 })
  }
  if (comment.trim().length < 10) {
    return NextResponse.json({ error: 'Yorum en az 10 karakter olmalı' }, { status: 400 })
  }

  const review = await prisma.review.create({
    data: { productId, name: name.trim(), rating: Number(rating), comment: comment.trim() },
  })
  return NextResponse.json(review, { status: 201 })
}

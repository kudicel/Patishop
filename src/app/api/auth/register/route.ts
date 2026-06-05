import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json() as {
      name: string
      email: string
      password: string
    }

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name: name.trim(), email: email.toLowerCase(), password: hashed },
    })

    return NextResponse.json({ id: user.id, name: user.name, email: user.email }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Kayıt sırasında bir hata oluştu.' }, { status: 500 })
  }
}

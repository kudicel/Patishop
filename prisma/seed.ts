import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import bcrypt from 'bcryptjs'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db'
  const adapter = new PrismaBetterSqlite3({ url: dbUrl })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma = new (PrismaClient as any)({ adapter })

  const hashed = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@patishop.com' },
    update: { role: 'admin', password: hashed, name: 'PatiShop Admin' },
    create: { email: 'admin@patishop.com', name: 'PatiShop Admin', password: hashed, role: 'admin' },
  })

  console.log('✅ Admin kullanıcı hazır:')
  console.log('   E-posta : admin@patishop.com')
  console.log('   Şifre   : admin123')
  console.log('   ID      :', admin.id)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })

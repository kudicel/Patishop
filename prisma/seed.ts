import dotenv from 'dotenv'
import { resolve } from 'path'
dotenv.config({ path: resolve(process.cwd(), '.env') })

import { PrismaNeonHttp } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'

async function main() {
  const { PrismaClient } = await import('../src/generated/prisma/client')
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prisma  = new (PrismaClient as any)({ adapter })

  const hashed = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where:  { email: 'admin@patishop.com' },
    update: { role: 'admin', password: hashed, name: 'PatiShop Admin' },
    create: { email: 'admin@patishop.com', name: 'PatiShop Admin', password: hashed, role: 'admin' },
  })

  console.log('✅ Admin hazır:', admin.email)
}

main().catch(e => { console.error(e); process.exit(1) })

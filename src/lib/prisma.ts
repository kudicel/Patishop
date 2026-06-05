import { PrismaNeonHttp } from '@prisma/adapter-neon'
import { PrismaClient } from '@/generated/prisma/client'

function createClient() {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL?.trim()!, {})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new (PrismaClient as any)({ adapter }) as PrismaClient
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

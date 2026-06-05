import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { AdminNav } from '@/components/AdminNav'

export const metadata = { title: 'PatiShop Admin' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/admin')
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (user?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen">
      <AdminNav userName={user.name ?? user.email} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppNavbar } from '@/components/app-navbar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/landing')
  }

  return (
    <div className='min-h-screen bg-background'>
      <AppNavbar />
      <main className='container mx-auto px-4 py-8'>{children}</main>
    </div>
  )
}

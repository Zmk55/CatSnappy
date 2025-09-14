'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Home,
  Camera,
  Search,
  User,
  LogOut,
  Settings,
  Heart,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function AppNavbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navItems = [
    { href: '/feed', icon: Home, label: 'Feed' },
    { href: '/upload', icon: Camera, label: 'Upload' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/profile/me', icon: User, label: 'Profile' },
  ]

  return (
    <nav className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-2 sm:px-4'>
        <div className='flex h-14 sm:h-16 items-center justify-between'>
          {/* Logo */}
          <Link
            href='/feed'
            className='flex items-center space-x-1 sm:space-x-2'
          >
            <img
              src='/Cat_NoName.png'
              alt='Cat Logo'
              className='w-16 h-16 sm:w-20 sm:h-20'
            />
            <img
              src='/CatSnappy_Name.png'
              alt='CatSnappy Text'
              className='h-10 sm:h-12 w-auto'
            />
          </Link>

          {/* Navigation Items */}
          <div className='flex items-center space-x-0.5 sm:space-x-1'>
            {navItems.map(item => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                (item.href === '/profile/me' &&
                  pathname.startsWith('/profile/'))

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size='sm'
                    className={cn(
                      'flex items-center space-x-1 sm:space-x-2 h-8 sm:h-9 px-2 sm:px-3',
                      isActive && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <Icon className='w-4 h-4' />
                    <span className='hidden sm:inline text-xs sm:text-sm'>
                      {item.label}
                    </span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className='flex items-center space-x-1 sm:space-x-2'>
            <ThemeToggle />
            {session?.user && (
              <>
                <Link href='/profile/me'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 sm:h-9 sm:w-9 p-0'
                  >
                    <Avatar className='w-6 h-6 sm:w-7 sm:h-7'>
                      <AvatarImage
                        src={session.user.image || '/default-avatar.svg'}
                        alt={session.user.name || 'User'}
                      />
                      <AvatarFallback>
                        {session.user.name
                          ? session.user.name.charAt(0).toUpperCase()
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </Link>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => signOut()}
                  className='h-8 w-8 sm:h-9 sm:w-9 p-0'
                >
                  <LogOut className='w-4 h-4' />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

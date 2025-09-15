'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function SignInPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        login,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Invalid email/username or password',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success',
          description: 'Welcome back!',
        })
        router.push('/feed')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/feed' })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-md w-full space-y-8 p-8'>
        <div className='text-center'>
          <Link href='/' className='flex items-center justify-center mb-6'>
            <img
              src='/Cat_NoName.png'
              alt='Cat Logo'
              className='w-24 h-24 -mr-4'
            />
            <img
              src='/CatSnappy_Name.png'
              alt='CatSnappy Text'
              className='w-48 h-24 object-cover'
            />
          </Link>
          <h2 className='text-2xl font-bold'>Welcome back</h2>
          <p className='text-muted-foreground'>Sign in to your account</p>
        </div>

        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='login' className='block text-sm font-medium mb-2'>
              Email or Username
            </label>
            <input
              id='login'
              type='text'
              required
              value={login}
              onChange={e => setLogin(e.target.value)}
              className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
              placeholder='Enter your email or username'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium mb-2'
            >
              Password
            </label>
            <input
              id='password'
              type='password'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
              placeholder='Enter your password'
            />
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-border' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-background text-muted-foreground'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          className='w-full'
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='currentColor'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='currentColor'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='currentColor'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          Google
        </Button>

        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link href='/auth/signup' className='text-primary hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

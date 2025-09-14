import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Camera, Users, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800'>
      {/* Header */}
      <header className='container mx-auto px-4 py-6'>
        <nav className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <img
              src='/Cat_NoName.png'
              alt='Cat Logo'
              className='w-20 h-20'
            />
            <img
              src='/CatSnappy_Name.png'
              alt='CatSnappy Text'
              className='h-12 w-auto'
            />
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/auth/signin'>
              <Button variant='ghost'>Sign In</Button>
            </Link>
            <Link href='/auth/signup'>
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className='container mx-auto px-4 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-bold mb-6'>
            Instagram for <span className='gradient-text'>Cat Lovers</span>
          </h1>
          <p className='text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Share and discover the cutest cat moments with fellow cat
            enthusiasts. Because every cat deserves to be famous! 🐱
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/auth/signup'>
              <Button size='lg' className='text-lg px-8 py-6'>
                <Camera className='w-5 h-5 mr-2' />
                Start Sharing
              </Button>
            </Link>
            <Link href='/feed'>
              <Button size='lg' variant='outline' className='text-lg px-8 py-6'>
                <Users className='w-5 h-5 mr-2' />
                Browse Feed
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className='mt-24 grid md:grid-cols-3 gap-8'>
          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Camera className='w-8 h-8 text-blue-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Share Cat Photos</h3>
            <p className='text-muted-foreground'>
              Upload and share your cat&apos;s most adorable moments with the
              world.
            </p>
          </div>

          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Heart className='w-8 h-8 text-purple-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Like & Comment</h3>
            <p className='text-muted-foreground'>
              Show your love for other cats and connect with fellow cat lovers.
            </p>
          </div>

          <div className='text-center p-6'>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Sparkles className='w-8 h-8 text-green-600' />
            </div>
            <h3 className='text-xl font-semibold mb-2'>Discover</h3>
            <p className='text-muted-foreground'>
              Find amazing cat content and discover new feline friends to
              follow.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className='mt-24 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Ready to join the cat community?
          </h2>
          <p className='text-lg text-muted-foreground mb-8'>
            Sign up today and start sharing your cat&apos;s cutest moments!
          </p>
          <Link href='/auth/signup'>
            <Button size='lg' className='text-lg px-8 py-6'>
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className='container mx-auto px-4 py-8 mt-16 border-t'>
        <div className='text-center text-muted-foreground'>
          <p>&copy; 2024 CatSnappy. Made with ❤️ for cat lovers everywhere.</p>
        </div>
      </footer>
    </div>
  )
}

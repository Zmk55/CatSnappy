import { FeedGrid } from '@/components/feed-grid'
import { Suspense } from 'react'

export default function FeedPage() {
  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Cat Feed</h1>
        <p className='text-muted-foreground'>
          Discover the cutest cat moments from our community
        </p>
      </div>

      <Suspense fallback={<FeedSkeleton />}>
        <FeedGrid />
      </Suspense>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className='masonry-grid'>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className='masonry-item'>
          <div className='bg-card rounded-lg p-4 space-y-3'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-muted rounded-full animate-pulse' />
              <div className='space-y-2'>
                <div className='h-4 bg-muted rounded animate-pulse w-24' />
                <div className='h-3 bg-muted rounded animate-pulse w-16' />
              </div>
            </div>
            <div className='aspect-square bg-muted rounded-lg animate-pulse' />
            <div className='space-y-2'>
              <div className='h-4 bg-muted rounded animate-pulse w-full' />
              <div className='h-4 bg-muted rounded animate-pulse w-3/4' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

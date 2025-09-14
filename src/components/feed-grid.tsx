'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { PostCard } from './post-card'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

interface Post {
  id: string
  caption: string | null
  imageUrl: string
  blurhash: string | null
  createdAt: string
  author: {
    id: string
    name: string | null
    handle: string
    image: string | null
  }
  tags: Array<{ name: string }>
  _count: {
    likes: number
    comments: number
    votes: number
  }
}

interface FeedResponse {
  items: Post[]
  nextCursor?: string
  hasMore: boolean
}

async function fetchPosts(cursor?: string): Promise<FeedResponse> {
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)

  const response = await fetch(`/api/posts?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

export function FeedGrid() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => fetchPosts(pageParam),
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    initialPageParam: undefined as string | undefined,
  })

  if (isLoading) {
    return <FeedSkeleton />
  }

  if (isError) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground mb-4'>
          Failed to load posts. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const allPosts = data?.pages.flatMap(page => page.items) || []

  if (allPosts.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground mb-4'>
          No posts yet. Be the first to share a cat photo!
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className='masonry-grid'>
        {allPosts.map(post => (
          <div key={post.id} className='masonry-item'>
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className='text-center mt-8'>
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant='outline'
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
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

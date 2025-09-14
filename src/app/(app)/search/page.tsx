'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Search, Hash } from 'lucide-react'
import { debounce } from '@/lib/utils'

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

interface SearchResponse {
  items: Post[]
  nextCursor?: string
  hasMore: boolean
}

async function searchPosts(
  query: string,
  tag?: string
): Promise<SearchResponse> {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (tag) params.set('tag', tag)

  const response = await fetch(`/api/posts?${params}`)
  if (!response.ok) {
    throw new Error('Failed to search posts')
  }
  return response.json()
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', searchQuery, selectedTag],
    queryFn: () => searchPosts(searchQuery, selectedTag || undefined),
    enabled: searchQuery.length > 0 || selectedTag !== null,
  })

  const popularTags = [
    'cute',
    'sleepy',
    'majestic',
    'floof',
    'kitten',
    'adorable',
    'playful',
    'grumpy',
    'orange',
    'black',
    'white',
    'tabby',
  ]

  const posts = data?.items || []

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Search Cat Photos</h1>
        <p className='text-muted-foreground'>
          Find the cutest cat moments from our community
        </p>
      </div>

      {/* Search Bar */}
      <div className='mb-6'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
          <input
            type='text'
            placeholder='Search for cats, captions, or users...'
            className='w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
            onChange={e => debouncedSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Popular Tags */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-4'>Popular Tags</h2>
        <div className='flex flex-wrap gap-2'>
          {popularTags.map(tag => (
            <Button
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              size='sm'
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className='flex items-center space-x-1'
            >
              <Hash className='w-3 h-3' />
              <span>{tag}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {isLoading ? (
        <SearchSkeleton />
      ) : isError ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground mb-4'>
            Failed to search posts. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : posts.length > 0 ? (
        <div>
          <div className='mb-4'>
            <p className='text-sm text-muted-foreground'>
              Found {posts.length} result{posts.length !== 1 ? 's' : ''}
              {searchQuery && ` for "${searchQuery}"`}
              {selectedTag && ` in #${selectedTag}`}
            </p>
          </div>
          <div className='masonry-grid'>
            {posts.map(post => (
              <div key={post.id} className='masonry-item'>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      ) : searchQuery || selectedTag ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground mb-4'>
            No posts found
            {searchQuery && ` for "${searchQuery}"`}
            {selectedTag && ` in #${selectedTag}`}
          </p>
          <Button
            variant='outline'
            onClick={() => {
              setSearchQuery('')
              setSelectedTag(null)
            }}
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className='text-center py-12'>
          <Search className='w-16 h-16 mx-auto mb-4 text-muted-foreground' />
          <p className='text-muted-foreground'>
            Start typing to search for cat photos or click on a popular tag
          </p>
        </div>
      )}
    </div>
  )
}

function SearchSkeleton() {
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

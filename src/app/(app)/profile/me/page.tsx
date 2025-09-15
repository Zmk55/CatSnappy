'use client'

import { useSession } from 'next-auth/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Settings } from 'lucide-react'
import Link from 'next/link'

interface User {
  id: string
  name: string | null
  handle: string
  email: string
  image: string | null
  bio: string | null
  createdAt: string
  _count: {
    posts: number
    likes: number
    comments: number
  }
}

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

async function fetchUserProfile(): Promise<User> {
  const response = await fetch('/api/profiles/me')
  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }
  return response.json()
}

async function fetchUserPosts(): Promise<Post[]> {
  const response = await fetch('/api/profiles/me/posts')
  if (!response.ok) {
    throw new Error('Failed to fetch user posts')
  }
  return response.json()
}

export default function MyProfilePage() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
  })

  const handleRefreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
  }

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['user-posts'],
    queryFn: fetchUserPosts,
  })

  if (userLoading) {
    return <ProfileSkeleton />
  }

  if (!user) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Failed to load profile</p>
      </div>
    )
  }

  // Debug logging
  console.log('Profile page - user data:', user)
  console.log('Profile page - user.image:', user.image)
  console.log('Profile page - session data:', session)
  console.log('Profile page - session.user.image:', session?.user?.image)

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Profile Header */}
      <div className='bg-card rounded-lg p-6 mb-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6'>
          <Avatar className='w-24 h-24'>
            <AvatarImage
              src={`${user.image || session?.user?.image || '/default-avatar.svg'}?v=${Math.random()}&t=${Date.now()}`}
              alt={user.name || user.handle}
              onError={e => {
                console.error(
                  'Avatar image failed to load:',
                  user.image || session?.user?.image,
                  e
                )
              }}
              onLoad={() => {
                console.log(
                  'Avatar image loaded successfully:',
                  user.image || session?.user?.image
                )
              }}
            />
            <AvatarFallback>
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.handle.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1'>
            <div className='flex items-center space-x-4 mb-2'>
              <h1 className='text-2xl font-bold'>{user.name || user.handle}</h1>
              <Button
                variant='outline'
                size='sm'
                onClick={handleRefreshProfile}
              >
                Refresh
              </Button>
              <Link href='/settings'>
                <Button variant='outline' size='sm'>
                  <Settings className='w-4 h-4 mr-2' />
                  Settings
                </Button>
              </Link>
            </div>
            <p className='text-muted-foreground mb-2'>@{user.handle}</p>
            {user.bio && <p className='text-sm mb-4'>{user.bio}</p>}
            <div className='flex space-x-6 text-sm'>
              <div>
                <span className='font-semibold'>{user._count.posts}</span>
                <span className='text-muted-foreground ml-1'>posts</span>
              </div>
              <div>
                <span className='font-semibold'>{user._count.likes}</span>
                <span className='text-muted-foreground ml-1'>likes given</span>
              </div>
              <div>
                <span className='font-semibold'>{user._count.comments}</span>
                <span className='text-muted-foreground ml-1'>comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-xl font-semibold'>Your Posts</h2>
          <Link href='/upload'>
            <Button>
              <Edit className='w-4 h-4 mr-2' />
              New Post
            </Button>
          </Link>
        </div>

        {postsLoading ? (
          <PostsSkeleton />
        ) : posts && posts.length > 0 ? (
          <div className='masonry-grid'>
            {posts.map(post => (
              <div key={post.id} className='masonry-item'>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <p className='text-muted-foreground mb-4'>
              You haven&apos;t shared any cat photos yet!
            </p>
            <Link href='/upload'>
              <Button>Share Your First Photo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className='max-w-4xl mx-auto'>
      <div className='bg-card rounded-lg p-6 mb-8'>
        <div className='flex items-center space-x-6'>
          <div className='w-24 h-24 bg-muted rounded-full animate-pulse' />
          <div className='flex-1 space-y-3'>
            <div className='h-6 bg-muted rounded animate-pulse w-48' />
            <div className='h-4 bg-muted rounded animate-pulse w-32' />
            <div className='h-4 bg-muted rounded animate-pulse w-64' />
            <div className='flex space-x-6'>
              <div className='h-4 bg-muted rounded animate-pulse w-16' />
              <div className='h-4 bg-muted rounded animate-pulse w-20' />
              <div className='h-4 bg-muted rounded animate-pulse w-18' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostsSkeleton() {
  return (
    <div className='masonry-grid'>
      {Array.from({ length: 6 }).map((_, i) => (
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

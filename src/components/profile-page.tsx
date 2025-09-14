'use client'

import { PostCard } from './post-card'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, Settings } from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string | null
  handle: string
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

interface ProfilePageProps {
  user: User
  posts: Post[]
}

export function ProfilePage({ user, posts }: ProfilePageProps) {
  const { data: session } = useSession()
  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Profile Header */}
      <div className='bg-card rounded-lg p-6 mb-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6'>
          <Avatar className='w-24 h-24'>
            <AvatarImage
              src={user.image || '/default-avatar.svg'}
              alt={user.name || user.handle}
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
              {isOwnProfile && (
                <Link href='/settings'>
                  <Button variant='outline' size='sm'>
                    <Settings className='w-4 h-4 mr-2' />
                    Settings
                  </Button>
                </Link>
              )}
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
          <h2 className='text-xl font-semibold'>Posts</h2>
          {isOwnProfile && (
            <Link href='/upload'>
              <Button>
                <Edit className='w-4 h-4 mr-2' />
                New Post
              </Button>
            </Link>
          )}
        </div>

        {posts.length > 0 ? (
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
              {isOwnProfile
                ? "You haven't shared any cat photos yet!"
                : `${user.handle} hasn't shared any cat photos yet.`}
            </p>
            {isOwnProfile && (
              <Link href='/upload'>
                <Button>Share Your First Photo</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

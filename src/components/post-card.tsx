'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { LikeButton } from './like-button'
import { VoteToggle } from './vote-toggle'
import { CommentButton } from './comment-button'
import { Tag } from './ui/tag'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

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

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  // Safety check for missing author data
  if (!post.author) {
    console.error('PostCard: Missing author data for post:', post.id)
    return null
  }

  return (
    <div className='modern-card rounded-xl overflow-hidden'>
      {/* Header */}
      <div className='p-3 sm:p-4 pb-2'>
        <div className='flex items-center space-x-3'>
          <Link href={`/profile/${post.author.handle}`}>
            <Avatar className='w-8 h-8 sm:w-10 sm:h-10'>
              <AvatarImage
                src={post.author.image || '/default-avatar.svg'}
                alt={post.author.name || post.author.handle}
              />
              <AvatarFallback>
                {post.author.name
                  ? post.author.name.charAt(0).toUpperCase()
                  : post.author.handle.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex-1 min-w-0'>
            <Link href={`/profile/${post.author.handle}`}>
              <p className='font-semibold text-sm hover:underline truncate'>
                {post.author.name || post.author.handle}
              </p>
            </Link>
            <p className='text-xs text-muted-foreground'>
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Image */}
      <div className='relative'>
        <Link href={`/image/${post.id}`}>
          <div className='relative aspect-square w-full'>
            {!imageLoaded && post.blurhash && (
              <div
                className='absolute inset-0 bg-cover bg-center'
                style={{
                  backgroundImage: `url(data:image/svg+xml;base64,${Buffer.from(
                    `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="20"/>
                        </filter>
                      </defs>
                      <rect width="100%" height="100%" fill="#f3f4f6"/>
                      <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="24" fill="#9ca3af">
                        🐱
                      </text>
                    </svg>`
                  ).toString('base64')})`,
                }}
              />
            )}
            <Image
              src={post.imageUrl}
              alt={post.caption || 'Cat photo'}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </div>
        </Link>
      </div>

      {/* Actions */}
      <div className='p-3 sm:p-4 pt-2'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center space-x-2 sm:space-x-4'>
            <LikeButton postId={post.id} initialCount={post._count.likes} />
            <CommentButton postId={post.id} count={post._count.comments} />
          </div>
          <VoteToggle postId={post.id} />
        </div>

        {/* Caption */}
        {post.caption && (
          <div className='mb-3'>
            <p className='text-sm'>
              <Link href={`/profile/${post.author.handle}`}>
                <span className='font-semibold hover:underline'>
                  {post.author.handle}
                </span>
              </Link>{' '}
              {post.caption}
            </p>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-2'>
            {post.tags.map(tag => (
              <Link key={tag.name} href={`/search?tag=${tag.name}`}>
                <Tag variant='secondary' className='text-xs'>
                  #{tag.name}
                </Tag>
              </Link>
            ))}
          </div>
        )}

        {/* View Comments Link */}
        {post._count.comments > 0 && (
          <Link href={`/image/${post.id}`}>
            <button className='text-sm text-muted-foreground hover:underline'>
              View all {post._count.comments} comment
              {post._count.comments !== 1 ? 's' : ''}
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

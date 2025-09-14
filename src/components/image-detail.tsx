'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LikeButton } from './like-button'
import { VoteToggle } from './vote-toggle'
import { CommentList } from './comment-list'
import { CommentForm } from './comment-form'
import { Tag } from './ui/tag'
import { ArrowLeft, Share2 } from 'lucide-react'
import { Button } from './ui/button'

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

interface ImageDetailProps {
  post: Post
}

export function ImageDetail({ post }: ImageDetailProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Back Button */}
      <div className='mb-6'>
        <Link href='/feed'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Feed
          </Button>
        </Link>
      </div>

      <div className='grid md:grid-cols-2 gap-8'>
        {/* Image */}
        <div className='relative'>
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
              className={`object-cover rounded-lg transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        </div>

        {/* Details */}
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Link href={`/profile/${post.author.handle}`}>
                <Avatar className='w-12 h-12'>
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
              <div>
                <Link href={`/profile/${post.author.handle}`}>
                  <p className='font-semibold hover:underline'>
                    {post.author.name || post.author.handle}
                  </p>
                </Link>
                <p className='text-sm text-muted-foreground'>
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <Button variant='outline' size='sm'>
              <Share2 className='w-4 h-4' />
            </Button>
          </div>

          {/* Actions */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <LikeButton postId={post.id} initialCount={post._count.likes} />
            </div>
            <VoteToggle postId={post.id} />
          </div>

          {/* Caption */}
          {post.caption && (
            <div>
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
            <div className='flex flex-wrap gap-2'>
              {post.tags.map(tag => (
                <Link key={tag.name} href={`/search?tag=${tag.name}`}>
                  <Tag variant='secondary' className='text-xs'>
                    #{tag.name}
                  </Tag>
                </Link>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>
              {post._count.comments} comment
              {post._count.comments !== 1 ? 's' : ''}
            </h3>
            <CommentList postId={post.id} />
            <CommentForm postId={post.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface Comment {
  id: string
  body: string
  createdAt: string
  author: {
    id: string
    name: string | null
    handle: string
    image: string | null
  }
}

interface CommentListProps {
  postId: string
}

async function fetchComments(postId: string): Promise<Comment[]> {
  const response = await fetch(`/api/comments?postId=${postId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch comments')
  }
  return response.json()
}

export function CommentList({ postId }: CommentListProps) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  })

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex space-x-3'>
            <div className='w-8 h-8 bg-muted rounded-full animate-pulse' />
            <div className='flex-1 space-y-2'>
              <div className='h-4 bg-muted rounded animate-pulse w-24' />
              <div className='h-4 bg-muted rounded animate-pulse w-full' />
              <div className='h-4 bg-muted rounded animate-pulse w-3/4' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        <p>No comments yet. Be the first to comment!</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {comments.map(comment => (
        <div key={comment.id} className='flex space-x-3'>
          <Link href={`/profile/${comment.author.handle}`}>
            <Avatar className='w-8 h-8'>
              <AvatarImage
                src={comment.author.image || '/default-avatar.svg'}
                alt={comment.author.name || comment.author.handle}
              />
              <AvatarFallback>
                {comment.author.name
                  ? comment.author.name.charAt(0).toUpperCase()
                  : comment.author.handle.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className='flex-1'>
            <div className='flex items-center space-x-2'>
              <Link href={`/profile/${comment.author.handle}`}>
                <span className='font-semibold text-sm hover:underline'>
                  {comment.author.handle}
                </span>
              </Link>
              <span className='text-xs text-muted-foreground'>
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className='text-sm mt-1'>{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

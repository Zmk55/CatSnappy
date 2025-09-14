'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

interface CommentButtonProps {
  postId: string
  count: number
}

export function CommentButton({ postId, count }: CommentButtonProps) {
  return (
    <Link href={`/image/${postId}`}>
      <Button
        variant='ghost'
        size='sm'
        className='flex items-center space-x-1 text-muted-foreground hover:text-blue-500 h-8 px-1.5 min-w-0'
      >
        <MessageCircle className='w-4 h-4' />
        <span className='text-sm'>{count}</span>
      </Button>
    </Link>
  )
}

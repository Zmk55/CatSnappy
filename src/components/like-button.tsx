'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'

interface LikeButtonProps {
  postId: string
  initialCount: number
}

export function LikeButton({ postId, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    const previousLiked = liked
    const previousCount = count

    // Optimistic update
    setLiked(!liked)
    setCount(prev => prev + (liked ? -1 : 1))

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()
      setLiked(data.liked)
      setCount(data.count)
    } catch (error) {
      // Revert optimistic update
      setLiked(previousLiked)
      setCount(previousCount)

      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center justify-center space-x-1 h-8 px-2 ${
        liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
      }`}
    >
      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
      <span className='text-sm font-medium'>{count}</span>
    </Button>
  )
}

'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from './ui/button'
import { useToast } from '@/hooks/use-toast'

interface VoteToggleProps {
  postId: string
}

export function VoteToggle({ postId }: VoteToggleProps) {
  const [userVote, setUserVote] = useState<'UP' | 'DOWN' | null>(null)
  const [upVotes, setUpVotes] = useState(0)
  const [downVotes, setDownVotes] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (isLoading) return

    setIsLoading(true)
    const previousVote = userVote
    const previousUpVotes = upVotes
    const previousDownVotes = downVotes

    // Optimistic update
    if (userVote === type) {
      setUserVote(null)
      if (type === 'UP') setUpVotes(prev => prev - 1)
      else setDownVotes(prev => prev - 1)
    } else {
      if (userVote === 'UP') setUpVotes(prev => prev - 1)
      else if (userVote === 'DOWN') setDownVotes(prev => prev - 1)

      setUserVote(type)
      if (type === 'UP') setUpVotes(prev => prev + 1)
      else setDownVotes(prev => prev + 1)
    }

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, type }),
      })

      if (!response.ok) {
        throw new Error('Failed to vote')
      }

      const data = await response.json()
      setUserVote(data.userVote)
      setUpVotes(data.upVotes)
      setDownVotes(data.downVotes)
    } catch (error) {
      // Revert optimistic update
      setUserVote(previousVote)
      setUpVotes(previousUpVotes)
      setDownVotes(previousDownVotes)

      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center space-x-1'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => handleVote('UP')}
        disabled={isLoading}
        className={`flex items-center space-x-1 ${
          userVote === 'UP'
            ? 'text-green-500'
            : 'text-muted-foreground hover:text-green-500'
        }`}
      >
        <ThumbsUp
          className={`w-4 h-4 ${userVote === 'UP' ? 'fill-current' : ''}`}
        />
        <span className='text-sm'>{upVotes}</span>
      </Button>

      <Button
        variant='ghost'
        size='sm'
        onClick={() => handleVote('DOWN')}
        disabled={isLoading}
        className={`flex items-center space-x-1 ${
          userVote === 'DOWN'
            ? 'text-red-500'
            : 'text-muted-foreground hover:text-red-500'
        }`}
      >
        <ThumbsDown
          className={`w-4 h-4 ${userVote === 'DOWN' ? 'fill-current' : ''}`}
        />
        <span className='text-sm'>{downVotes}</span>
      </Button>
    </div>
  )
}

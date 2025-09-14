'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

interface CommentFormProps {
  postId: string
}

async function createComment(postId: string, body: string) {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId, body }),
  })

  if (!response.ok) {
    throw new Error('Failed to create comment')
  }

  return response.json()
}

export function CommentForm({ postId }: CommentFormProps) {
  const [body, setBody] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (body: string) => createComment(postId, body),
    onSuccess: () => {
      setBody('')
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been added.',
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive',
      })
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!body.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await mutation.mutateAsync(body.trim())
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <Textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder='Add a comment...'
        className='min-h-[80px] resize-none'
        maxLength={1000}
      />
      <div className='flex justify-between items-center'>
        <span className='text-xs text-muted-foreground'>
          {body.length}/1000 characters
        </span>
        <Button type='submit' disabled={!body.trim() || isSubmitting} size='sm'>
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </div>
    </form>
  )
}

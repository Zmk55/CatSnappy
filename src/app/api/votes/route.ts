import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { votePostSchema } from '@/lib/zodSchemas'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId, type } = votePostSchema.parse(body)

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        await prisma.vote.delete({
          where: {
            id: existingVote.id,
          },
        })
      } else {
        // Update vote type
        await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            type,
          },
        })
      }
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          postId,
          userId: session.user.id,
          type,
        },
      })
    }

    // Get updated vote counts
    const [upVotes, downVotes] = await Promise.all([
      prisma.vote.count({
        where: { postId, type: 'UP' },
      }),
      prisma.vote.count({
        where: { postId, type: 'DOWN' },
      }),
    ])

    return NextResponse.json({
      upVotes,
      downVotes,
      userVote: existingVote?.type === type ? null : type,
    })
  } catch (error) {
    console.error('Error voting on post:', error)
    return NextResponse.json(
      { error: 'Failed to vote on post' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { likePostSchema } from '@/lib/zodSchemas'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId } = likePostSchema.parse(body)

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Check if user already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      })
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    })

    return NextResponse.json({
      liked: !existingLike,
      count: likeCount,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params

    const user = await prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        name: true,
        handle: true,
        image: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's posts
    const posts = await prisma.post.findMany({
      where: {
        authorId: user.id,
        isReported: false,
      },
      include: {
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      user,
      posts,
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
        isReported: false,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            handle: true,
            image: true,
          },
        },
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

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching user posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user posts' },
      { status: 500 }
    )
  }
}

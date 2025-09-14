import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createPostSchema, searchPostsSchema } from '@/lib/zodSchemas'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const { q, tag, cursor, limit } = searchPostsSchema.parse({
      q: searchParams.get('q') || undefined,
      tag: searchParams.get('tag') || undefined,
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit')
        ? parseInt(searchParams.get('limit')!)
        : 20,
    })

    const where: any = {
      isReported: false,
    }

    if (q) {
      where.OR = [
        { caption: { contains: q, mode: 'insensitive' } },
        { author: { name: { contains: q, mode: 'insensitive' } } },
        { author: { handle: { contains: q, mode: 'insensitive' } } },
      ]
    }

    if (tag) {
      where.tags = {
        some: {
          name: tag,
        },
      }
    }

    const posts = await prisma.post.findMany({
      where,
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
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
    })

    const hasMore = posts.length > limit
    const items = hasMore ? posts.slice(0, -1) : posts
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { caption, imageKey, tags } = createPostSchema.parse(body)

    // Get the user to ensure they exist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create or connect tags
    const tagConnections =
      tags?.map(tagName => ({
        where: { name: tagName },
        create: { name: tagName },
      })) || []

    const post = await prisma.post.create({
      data: {
        authorId: session.user.id,
        caption,
        imageKey,
        imageUrl: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${imageKey}`,
        tags: {
          connectOrCreate: tagConnections,
        },
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
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

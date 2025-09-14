import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateUserSchema } from '@/lib/zodSchemas'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        handle: true,
        email: true,
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateUserSchema.parse(body)

    // Check if handle is being updated and if it's unique
    if (validatedData.handle) {
      const existingUser = await prisma.user.findFirst({
        where: {
          handle: validatedData.handle,
          id: { not: session.user.id }, // Exclude current user
        },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        handle: true,
        email: true,
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

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      )
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}

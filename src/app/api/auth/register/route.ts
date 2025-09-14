import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createUserSchema } from '@/lib/zodSchemas'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, handle } = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { handle }],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or handle already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        handle,
        // Note: In a real app, you'd store the hashed password
        // For demo purposes, we're not storing passwords
      },
      select: {
        id: true,
        name: true,
        email: true,
        handle: true,
        createdAt: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const name = process.argv[4] || 'Admin User'

  if (!email || !password) {
    console.error(
      'Usage: tsx scripts/create-admin.ts <email> <password> [name]'
    )
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('❌ User with this email already exists')
      process.exit(1)
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(password, 12)

    const adminUser = await prisma.user.create({
      data: {
        email,
        name,
        handle: 'admin',
        bio: 'CatSnappy Administrator 🐱',
        // Note: In a real app, you'd store the hashed password
        // For demo purposes, we're not storing passwords
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`Email: ${adminUser.email}`)
    console.log(`Name: ${adminUser.name}`)
    console.log(`Handle: ${adminUser.handle}`)
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    process.exit(1)
  }
}

main().finally(async () => {
  await prisma.$disconnect()
})

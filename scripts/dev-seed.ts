#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import { encode } from 'blurhash'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting development seed...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@catsnappy.com' },
    update: {},
    create: {
      email: 'admin@catsnappy.com',
      handle: 'admin',
      name: 'Admin User',
      bio: 'CatSnappy Administrator 🐱',
    },
  })

  console.log('✅ Created admin user:', adminUser.handle)

  // Create demo users
  const demoUsers = [
    {
      email: 'fluffy@catsnappy.com',
      handle: 'fluffy_cat_mom',
      name: 'Fluffy Cat Mom',
      bio: 'Proud mom of 3 adorable cats! 🐱❤️',
    },
    {
      email: 'whiskers@catsnappy.com',
      handle: 'whiskers_lover',
      name: 'Whiskers Lover',
      bio: 'Cat photographer and enthusiast 📸🐱',
    },
    {
      email: 'meow@catsnappy.com',
      handle: 'meow_master',
      name: 'Meow Master',
      bio: 'Professional cat whisperer 🐱✨',
    },
  ]

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    })
    console.log(`✅ Created user: ${user.handle}`)
  }

  // Create popular tags
  const popularTags = [
    'cute',
    'sleepy',
    'majestic',
    'floof',
    'kitten',
    'cat',
    'adorable',
    'playful',
    'grumpy',
    'orange',
    'black',
    'white',
    'tabby',
    'persian',
    'siamese',
    'ragdoll',
    'maine-coon',
    'british-shorthair',
    'scottish-fold',
  ]

  for (const tagName of popularTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    })
  }

  console.log(`✅ Created ${popularTags.length} popular tags`)

  console.log('🎉 Development seed completed successfully!')
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

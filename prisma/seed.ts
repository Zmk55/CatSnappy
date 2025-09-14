import { PrismaClient } from '@prisma/client'
import { encode } from 'blurhash'

const prisma = new PrismaClient()

// Sample cat images with blurhashes
const samplePosts = [
  {
    caption: 'Just a sleepy cat enjoying the sunshine ☀️',
    imageUrl:
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
    blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
    tags: ['sleepy', 'sunshine', 'cute'],
  },
  {
    caption: 'My majestic floof surveying the kingdom 👑',
    imageUrl:
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    blurhash: 'LKO2?V%2Tw=w]~RBVZRi};RPxuwH',
    tags: ['majestic', 'floof', 'kingdom'],
  },
  {
    caption: 'Caught in the act of being absolutely adorable 🥺',
    imageUrl:
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop',
    blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
    tags: ['adorable', 'cute', 'kitten'],
  },
  {
    caption: 'The classic "I fits, I sits" pose 📦',
    imageUrl:
      'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800&h=600&fit=crop',
    blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.',
    tags: ['box', 'fits', 'sits'],
  },
  {
    caption: 'Mid-yawn perfection 😴',
    imageUrl:
      'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&h=600&fit=crop',
    blurhash: 'LKO2?V%2Tw=w]~RBVZRi};RPxuwH',
    tags: ['yawn', 'sleepy', 'perfection'],
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@catsnappy.com' },
    update: {},
    create: {
      email: 'demo@catsnappy.com',
      handle: 'demo_cat_lover',
      name: 'Demo Cat Lover',
      bio: 'Just here to share the cutest cat moments! 🐱',
      image:
        'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=150&h=150&fit=crop&crop=face',
    },
  })

  console.log('✅ Created demo user:', demoUser.handle)

  // Create tags
  const tagNames = [
    'cute',
    'sleepy',
    'majestic',
    'floof',
    'kitten',
    'box',
    'sunshine',
    'adorable',
    'kingdom',
    'fits',
    'sits',
    'yawn',
    'perfection',
  ]
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  )

  console.log('✅ Created tags:', tags.length)

  // Create sample posts
  for (const postData of samplePosts) {
    const post = await prisma.post.create({
      data: {
        authorId: demoUser.id,
        caption: postData.caption,
        imageKey: `sample/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`,
        imageUrl: postData.imageUrl,
        blurhash: postData.blurhash,
        tags: {
          connect: postData.tags.map(tagName => ({
            name: tagName,
          })),
        },
      },
    })

    // Add some random likes and votes
    const likeCount = Math.floor(Math.random() * 20) + 5
    const voteCount = Math.floor(Math.random() * 15) + 3

    // Create some likes (only one per user per post)
    if (Math.random() > 0.3) {
      // 70% chance of being liked
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: demoUser.id,
        },
      })
    }

    // Create some votes (mostly positive)
    if (Math.random() > 0.2) {
      // 80% chance of being voted
      await prisma.vote.create({
        data: {
          postId: post.id,
          userId: demoUser.id,
          type: Math.random() > 0.1 ? 'UP' : 'DOWN', // 90% positive votes
        },
      })
    }

    console.log(`✅ Created post: ${post.caption?.substring(0, 30)}...`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

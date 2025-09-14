import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ProfilePage } from '@/components/profile-page'

interface PageProps {
  params: Promise<{
    handle: string
  }>
}

export default async function UserProfilePage({ params }: PageProps) {
  const { handle } = await params
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
    notFound()
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
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

  return <ProfilePage 
    user={{
      ...user,
      createdAt: user.createdAt.toISOString(),
    }} 
    posts={posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    }))} 
  />
}

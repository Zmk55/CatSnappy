import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { ImageDetail } from '@/components/image-detail'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ImagePage({ params }: PageProps) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
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

  if (!post) {
    notFound()
  }

  return <ImageDetail post={post} />
}

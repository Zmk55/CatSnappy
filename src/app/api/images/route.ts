import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateSignedUploadUrl } from '@/lib/s3'
import { imageUploadSchema } from '@/lib/zodSchemas'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { contentType, size } = imageUploadSchema.parse(body)

    const { uploadUrl, key, publicUrl } = await generateSignedUploadUrl(
      contentType,
      session.user.id
    )

    return NextResponse.json({
      uploadUrl,
      key,
      publicUrl,
    })
  } catch (error) {
    console.error('Error generating upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

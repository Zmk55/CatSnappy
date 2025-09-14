import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { validateImageFile } from '@/lib/utils'
import AWS from 'aws-sdk'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Additional validation for profile pictures (smaller size limit)
    const maxSize = 5 * 1024 * 1024 // 5MB for profile pictures
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Profile picture must be less than 5MB' },
        { status: 400 }
      )
    }

    // Configure S3 client for MinIO
    const s3 = new AWS.S3({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      s3ForcePathStyle: true, // Required for MinIO
    })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `profile-pictures/${session.user.id}/${timestamp}.${fileExtension}`

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Upload to MinIO
    const uploadResult = await s3
      .upload({
        Bucket: process.env.S3_BUCKET!,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read',
      })
      .promise()

    return NextResponse.json({
      imageUrl: uploadResult.Location,
      filename: filename,
    })
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return NextResponse.json(
      { error: 'Failed to upload profile picture' },
      { status: 500 }
    )
  }
}

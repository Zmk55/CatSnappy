import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'

// Configure AWS SDK
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true, // Required for MinIO
})

const BUCKET_NAME = process.env.S3_BUCKET || 'catsnappy'

export interface UploadResult {
  key: string
  url: string
  publicUrl: string
}

export async function generateSignedUploadUrl(
  contentType: string,
  userId: string
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
  const key = `uploads/${userId}/${uuidv4()}.${getFileExtension(contentType)}`

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    Expires: 300, // 5 minutes
  })

  const publicUrl = `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`

  return {
    uploadUrl,
    key,
    publicUrl,
  }
}

export async function deleteImage(key: string): Promise<void> {
  await s3
    .deleteObject({
      Bucket: BUCKET_NAME,
      Key: key,
    })
    .promise()
}

export async function getImageUrl(key: string): Promise<string> {
  return `${process.env.S3_ENDPOINT}/${BUCKET_NAME}/${key}`
}

function getFileExtension(contentType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }

  return extensions[contentType] || 'jpg'
}

export async function ensureBucketExists(): Promise<void> {
  try {
    await s3.headBucket({ Bucket: BUCKET_NAME }).promise()
  } catch (error) {
    if ((error as any).statusCode === 404) {
      await s3.createBucket({ Bucket: BUCKET_NAME }).promise()
      console.log(`✅ Created S3 bucket: ${BUCKET_NAME}`)
    } else {
      throw error
    }
  }
}

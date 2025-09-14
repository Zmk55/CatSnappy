#!/usr/bin/env tsx

import AWS from 'aws-sdk'

async function setupMinIO() {
  try {
    // Configure S3 client for MinIO
    const s3 = new AWS.S3({
      endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:9000',
      region: process.env.S3_REGION || 'us-east-1',
      accessKeyId: process.env.S3_ACCESS_KEY || 'minioadmin',
      secretAccessKey: process.env.S3_SECRET_KEY || 'minioadmin',
      s3ForcePathStyle: true, // Required for MinIO
    })

    const bucketName = process.env.S3_BUCKET || 'catsnappy'

    // Check if bucket exists
    try {
      await s3.headBucket({ Bucket: bucketName }).promise()
      console.log(`✅ Bucket '${bucketName}' already exists`)
    } catch (error: any) {
      if (error.statusCode === 404) {
        // Bucket doesn't exist, create it
        console.log(`📦 Creating bucket '${bucketName}'...`)
        await s3.createBucket({ Bucket: bucketName }).promise()
        console.log(`✅ Bucket '${bucketName}' created successfully`)
      } else {
        throw error
      }
    }

    // Set bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }

    try {
      await s3
        .putBucketPolicy({
          Bucket: bucketName,
          Policy: JSON.stringify(bucketPolicy),
        })
        .promise()
      console.log(`✅ Bucket policy set for public read access`)
    } catch (error) {
      console.log(`⚠️  Could not set bucket policy:`, error)
    }

    console.log('🎉 MinIO setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up MinIO:', error)
    process.exit(1)
  }
}

setupMinIO()

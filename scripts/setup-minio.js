const AWS = require('aws-sdk')

// Configure AWS SDK for MinIO
const s3 = new AWS.S3({
  endpoint: 'http://localhost:9000',
  region: 'us-east-1',
  accessKeyId: 'minioadmin',
  secretAccessKey: 'minioadmin',
  s3ForcePathStyle: true,
})

async function setupMinIO() {
  try {
    console.log('🪣 Setting up MinIO bucket...')

    // Create bucket
    await s3.createBucket({ Bucket: 'catsnappy' }).promise()
    console.log('✅ Created bucket: catsnappy')

    // Set bucket policy to allow public read
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: 'arn:aws:s3:::catsnappy/*',
        },
      ],
    }

    await s3
      .putBucketPolicy({
        Bucket: 'catsnappy',
        Policy: JSON.stringify(policy),
      })
      .promise()

    console.log('✅ Set bucket policy for public read access')
    console.log('🎉 MinIO setup complete!')
  } catch (error) {
    if (error.code === 'BucketAlreadyOwnedByYou') {
      console.log('✅ Bucket already exists')
    } else {
      console.error('❌ Error setting up MinIO:', error.message)
    }
  }
}

setupMinIO()

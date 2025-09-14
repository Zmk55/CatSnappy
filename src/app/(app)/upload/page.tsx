'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { validateImageFile } from '@/lib/utils'
import { Camera, Upload, X } from 'lucide-react'
import { EmojiPicker } from '@/components/emoji-picker'

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file)

    if (!validation.valid) {
      toast({
        title: 'Invalid file',
        description: validation.error,
        variant: 'destructive',
      })
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = e => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an image to upload',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)

    try {
      // Get signed upload URL
      const uploadResponse = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType: selectedFile.type,
          size: selectedFile.size,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { uploadUrl, key } = await uploadResponse.json()

      // Upload file to S3
      const uploadResult = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      })

      if (!uploadResult.ok) {
        throw new Error('Failed to upload file')
      }

      // Create post
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption: caption || undefined,
          imageKey: key,
          tags: tags
            ? tags
                .split(',')
                .map(tag => tag.trim())
                .filter(Boolean)
            : undefined,
        }),
      })

      if (!postResponse.ok) {
        throw new Error('Failed to create post')
      }

      toast({
        title: 'Success!',
        description: 'Your cat photo has been shared!',
      })

      router.push('/feed')
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Share a Cat Photo</h1>
        <p className='text-muted-foreground'>
          Upload and share your cat&apos;s cutest moments with the community
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* File Upload */}
        <div>
          <label className='block text-sm font-medium mb-2'>Photo</label>
          {!selectedFile ? (
            <div
              className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <Camera className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
              <p className='text-lg font-medium mb-2'>
                Drop your cat photo here
              </p>
              <p className='text-sm text-muted-foreground mb-4'>
                or click to browse files
              </p>
              <p className='text-xs text-muted-foreground'>
                Supports JPEG, PNG, WebP, and GIF up to 10MB
              </p>
              <input
                id='file-input'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </div>
          ) : (
            <div className='relative'>
              <Image
                src={preview || ''}
                alt='Preview'
                width={400}
                height={256}
                className='w-full h-64 object-cover rounded-lg'
              />
              <button
                type='button'
                onClick={() => {
                  setSelectedFile(null)
                  setPreview(null)
                }}
                className='absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>

        {/* Caption */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <label htmlFor='caption' className='block text-sm font-medium'>
              Caption (optional)
            </label>
            <EmojiPicker
              onEmojiSelect={emoji => setCaption(prev => prev + emoji)}
            />
          </div>
          <textarea
            id='caption'
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder='Tell us about this adorable moment...'
            className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none'
            rows={3}
            maxLength={2000}
          />
          <p className='text-xs text-muted-foreground mt-1'>
            {caption.length}/2000 characters
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor='tags' className='block text-sm font-medium mb-2'>
            Tags (optional)
          </label>
          <input
            id='tags'
            type='text'
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder='cute, sleepy, orange (comma-separated)'
            className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
          />
          <p className='text-xs text-muted-foreground mt-1'>
            Add tags to help others discover your post
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={!selectedFile || isUploading}
          className='w-full'
        >
          {isUploading ? (
            <>
              <Upload className='w-4 h-4 mr-2 animate-spin' />
              Uploading...
            </>
          ) : (
            <>
              <Upload className='w-4 h-4 mr-2' />
              Share Photo
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

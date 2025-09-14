'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'
import { ArrowLeft, Camera, Save, User, Mail, Hash } from 'lucide-react'
import Link from 'next/link'
import { updateUserSchema } from '@/lib/zodSchemas'
import type { UpdateUserInput } from '@/lib/zodSchemas'

interface User {
  id: string
  name: string | null
  handle: string
  email: string
  image: string | null
  bio: string | null
  createdAt: string
}

async function fetchUserProfile(): Promise<User> {
  const response = await fetch('/api/profiles/me')
  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }
  return response.json()
}

async function updateUserProfile(data: UpdateUserInput): Promise<User> {
  const response = await fetch('/api/profiles/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update profile')
  }

  return response.json()
}

async function uploadProfilePicture(file: File): Promise<{ imageUrl: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/upload/profile-picture', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to upload profile picture')
  }

  return response.json()
}

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: fetchUserProfile,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async updatedUser => {
      queryClient.setQueryData(['user-profile'], updatedUser)
      // Force session refresh to get updated user data
      await update()
      toast.success('Profile updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (file.size > maxSize) {
      toast.error('Profile picture must be less than 5MB')
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, and WebP images are allowed')
      return
    }

    setIsUploading(true)
    try {
      const { imageUrl } = await uploadProfilePicture(file)

      // Update the profile with the new image URL
      await updateProfileMutation.mutateAsync({ image: imageUrl })

      // Force session refresh to get updated profile picture
      await update()

      toast.success('Profile picture updated!')
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to upload profile picture'
      )
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: UpdateUserInput) => {
    updateProfileMutation.mutate(data)
  }

  // Update form values when user data loads
  if (user && !watch('name')) {
    setValue('name', user.name || '')
    setValue('handle', user.handle || '')
    setValue('bio', user.bio || '')
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  if (!user) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Failed to load profile</p>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto'>
      {/* Header */}
      <div className='flex items-center space-x-4 mb-8'>
        <Link href='/profile/me'>
          <Button variant='ghost' size='sm'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Profile
          </Button>
        </Link>
        <div>
          <h1 className='text-2xl font-bold'>Settings</h1>
          <p className='text-muted-foreground'>Manage your account settings</p>
        </div>
      </div>

      <div className='space-y-6'>
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Camera className='w-5 h-5 mr-2' />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a new profile picture. Max size: 5MB
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center space-x-6'>
              <Avatar className='w-20 h-20'>
                <AvatarImage
                  src={user.image || '/default-avatar.svg'}
                  alt={user.name || user.handle}
                />
                <AvatarFallback>
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.handle.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/webp'
                  onChange={handleProfilePictureUpload}
                  disabled={isUploading}
                  className='hidden'
                  id='profile-picture-upload'
                />
                <Label htmlFor='profile-picture-upload'>
                  <Button variant='outline' disabled={isUploading} asChild>
                    <span>
                      <Camera className='w-4 h-4 mr-2' />
                      {isUploading ? 'Uploading...' : 'Change Picture'}
                    </span>
                  </Button>
                </Label>
                <p className='text-sm text-muted-foreground mt-2'>
                  JPG, PNG, or WebP. Max 5MB.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <User className='w-5 h-5 mr-2' />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your public profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              {/* Email (read-only) */}
              <div className='space-y-2'>
                <Label htmlFor='email' className='flex items-center'>
                  <Mail className='w-4 h-4 mr-2' />
                  Email
                </Label>
                <Input
                  id='email'
                  value={user.email}
                  disabled
                  className='bg-muted'
                />
                <p className='text-sm text-muted-foreground'>
                  Email cannot be changed
                </p>
              </div>

              {/* Handle (editable) */}
              <div className='space-y-2'>
                <Label htmlFor='handle' className='flex items-center'>
                  <Hash className='w-4 h-4 mr-2' />
                  Username
                </Label>
                <Input
                  id='handle'
                  {...register('handle')}
                  placeholder='Enter your username'
                />
                {errors.handle && (
                  <p className='text-sm text-red-500'>
                    {errors.handle.message}
                  </p>
                )}
                <p className='text-sm text-muted-foreground'>
                  This will be your unique username for logging in and sharing
                  your profile
                </p>
              </div>

              <Separator />

              {/* Name */}
              <div className='space-y-2'>
                <Label htmlFor='name'>Display Name</Label>
                <Input
                  id='name'
                  {...register('name')}
                  placeholder='Enter your display name'
                />
                {errors.name && (
                  <p className='text-sm text-destructive'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className='space-y-2'>
                <Label htmlFor='bio'>Bio</Label>
                <Textarea
                  id='bio'
                  {...register('bio')}
                  placeholder='Tell us about yourself...'
                  rows={4}
                />
                {errors.bio && (
                  <p className='text-sm text-destructive'>
                    {errors.bio.message}
                  </p>
                )}
                <p className='text-sm text-muted-foreground'>
                  {watch('bio')?.length || 0}/500 characters
                </p>
              </div>

              <Button
                type='submit'
                disabled={isSubmitting || updateProfileMutation.isPending}
              >
                <Save className='w-4 h-4 mr-2' />
                {isSubmitting || updateProfileMutation.isPending
                  ? 'Saving...'
                  : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className='max-w-2xl mx-auto'>
      <div className='flex items-center space-x-4 mb-8'>
        <div className='h-8 w-24 bg-muted rounded animate-pulse' />
        <div>
          <div className='h-8 w-32 bg-muted rounded animate-pulse mb-2' />
          <div className='h-4 w-48 bg-muted rounded animate-pulse' />
        </div>
      </div>

      <div className='space-y-6'>
        <div className='bg-card rounded-lg p-6'>
          <div className='h-6 w-32 bg-muted rounded animate-pulse mb-4' />
          <div className='flex items-center space-x-6'>
            <div className='w-20 h-20 bg-muted rounded-full animate-pulse' />
            <div className='h-10 w-32 bg-muted rounded animate-pulse' />
          </div>
        </div>

        <div className='bg-card rounded-lg p-6'>
          <div className='h-6 w-40 bg-muted rounded animate-pulse mb-4' />
          <div className='space-y-4'>
            <div className='h-10 w-full bg-muted rounded animate-pulse' />
            <div className='h-10 w-full bg-muted rounded animate-pulse' />
            <div className='h-10 w-full bg-muted rounded animate-pulse' />
            <div className='h-24 w-full bg-muted rounded animate-pulse' />
            <div className='h-10 w-32 bg-muted rounded animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  )
}

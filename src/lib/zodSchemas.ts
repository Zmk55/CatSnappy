import { z } from 'zod'

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Handle can only contain letters, numbers, and underscores'
    ),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  handle: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must be less than 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Handle can only contain letters, numbers, and underscores'
    )
    .optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  image: z.string().url('Invalid image URL').optional(),
})

// Post schemas
export const createPostSchema = z.object({
  caption: z
    .string()
    .max(2000, 'Caption must be less than 2000 characters')
    .optional(),
  imageKey: z.string().min(1, 'Image is required'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
})

export const updatePostSchema = z.object({
  caption: z
    .string()
    .max(2000, 'Caption must be less than 2000 characters')
    .optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').optional(),
})

// Comment schemas
export const createCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
})

// Like/Vote schemas
export const likePostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
})

export const votePostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  type: z.enum(['UP', 'DOWN'], {
    required_error: 'Vote type is required',
  }),
})

// Report schema
export const reportPostSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  reason: z
    .string()
    .min(10, 'Report reason must be at least 10 characters')
    .max(500, 'Report reason must be less than 500 characters'),
})

// Search schemas
export const searchPostsSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.number().min(1).max(50).default(20),
})

// Image upload schemas
export const imageUploadSchema = z.object({
  contentType: z
    .string()
    .regex(/^image\/(jpeg|jpg|png|webp|gif)$/, 'Invalid image type'),
  size: z.number().max(10 * 1024 * 1024, 'Image must be less than 10MB'), // 10MB limit
})

// API response schemas
export const paginatedResponseSchema = <T>(itemSchema: z.ZodType<T>) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().optional(),
    hasMore: z.boolean(),
  })

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type LikePostInput = z.infer<typeof likePostSchema>
export type VotePostInput = z.infer<typeof votePostSchema>
export type ReportPostInput = z.infer<typeof reportPostSchema>
export type SearchPostsInput = z.infer<typeof searchPostsSchema>
export type ImageUploadInput = z.infer<typeof imageUploadSchema>

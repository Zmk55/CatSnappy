import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths}mo ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears}y ago`
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`
  }

  return `${(num / 1000000).toFixed(1)}M`
}

export function generateHandle(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 20)
}

export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ]

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 10MB' }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only JPEG, PNG, WebP, and GIF images are allowed',
    }
  }

  return { valid: true }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

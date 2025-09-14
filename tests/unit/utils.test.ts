import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatNumber,
  generateHandle,
  validateImageFile,
} from '@/lib/utils'

describe('formatDate', () => {
  it('should format recent dates correctly', () => {
    const now = new Date()
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    expect(formatDate(oneMinuteAgo)).toBe('1m ago')
    expect(formatDate(oneHourAgo)).toBe('1h ago')
    expect(formatDate(oneDayAgo)).toBe('1d ago')
  })

  it('should handle just now', () => {
    const now = new Date()
    expect(formatDate(now)).toBe('just now')
  })
})

describe('formatNumber', () => {
  it('should format numbers correctly', () => {
    expect(formatNumber(123)).toBe('123')
    expect(formatNumber(1234)).toBe('1.2K')
    expect(formatNumber(1234567)).toBe('1.2M')
  })
})

describe('generateHandle', () => {
  it('should generate valid handles', () => {
    expect(generateHandle('John Doe')).toBe('john_doe')
    expect(generateHandle('Jane Smith!')).toBe('jane_smith')
    expect(generateHandle('Test User 123')).toBe('test_user_123')
  })

  it('should handle long names', () => {
    const longName = 'This is a very long name that should be truncated'
    const handle = generateHandle(longName)
    expect(handle.length).toBeLessThanOrEqual(20)
  })
})

describe('validateImageFile', () => {
  it('should validate correct image files', () => {
    const validFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }) // 1MB

    const result = validateImageFile(validFile)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject files that are too large', () => {
    const largeFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 }) // 11MB

    const result = validateImageFile(largeFile)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('10MB')
  })

  it('should reject invalid file types', () => {
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' })
    Object.defineProperty(invalidFile, 'size', { value: 1024 })

    const result = validateImageFile(invalidFile)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('JPEG, PNG, WebP, and GIF')
  })
})

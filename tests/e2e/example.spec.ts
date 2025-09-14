import { test, expect } from '@playwright/test'

test('homepage has title and navigation', async ({ page }) => {
  await page.goto('/')

  // Check if redirected to landing page
  await expect(page).toHaveURL('/landing')

  // Check page title
  await expect(page).toHaveTitle(/CatSnappy/)

  // Check main heading
  await expect(
    page.getByRole('heading', { name: /Instagram for Cat Lovers/i })
  ).toBeVisible()

  // Check navigation links
  await expect(page.getByRole('link', { name: /Sign In/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
})

test('can navigate to sign in page', async ({ page }) => {
  await page.goto('/landing')

  await page.getByRole('link', { name: /Sign In/i }).click()

  await expect(page).toHaveURL('/auth/signin')
  await expect(
    page.getByRole('heading', { name: /Welcome back/i })
  ).toBeVisible()
})

test('can navigate to sign up page', async ({ page }) => {
  await page.goto('/landing')

  await page.getByRole('link', { name: /Get Started/i }).click()

  await expect(page).toHaveURL('/auth/signup')
  await expect(
    page.getByRole('heading', { name: /Create your account/i })
  ).toBeVisible()
})

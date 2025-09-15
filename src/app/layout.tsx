import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/components/query-provider'
import { AuthSessionProvider } from '@/components/session-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CatSnappy - Instagram for Cat Lovers',
  description:
    'Share and discover the cutest cat moments with fellow cat enthusiasts',
  keywords: ['cats', 'social media', 'photos', 'pets', 'animals'],
  authors: [{ name: 'CatSnappy Team' }],
  creator: 'CatSnappy',
  publisher: 'CatSnappy',
  icons: {
    icon: '/Cat_NoName.png',
    shortcut: '/Cat_NoName.png',
    apple: '/Cat_NoName.png',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CatSnappy - Instagram for Cat Lovers',
    description:
      'Share and discover the cutest cat moments with fellow cat enthusiasts',
    siteName: 'CatSnappy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CatSnappy - Instagram for Cat Lovers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CatSnappy - Instagram for Cat Lovers',
    description:
      'Share and discover the cutest cat moments with fellow cat enthusiasts',
    images: ['/og-image.png'],
    creator: '@catsnappy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AuthSessionProvider>
            <QueryProvider>
              {children}
              <Toaster />
            </QueryProvider>
          </AuthSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

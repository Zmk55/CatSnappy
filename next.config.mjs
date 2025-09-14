/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const headers = [
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin',
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
      },
    ];

    // Only add HTTPS-related headers in production
    if (!isDevelopment) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    // CSP with conditional upgrade-insecure-requests
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' data:",
      "connect-src 'self' https: http:",
      "media-src 'self' data: blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ];

    // Only add upgrade-insecure-requests in production
    if (!isDevelopment) {
      cspDirectives.push("upgrade-insecure-requests");
    }

    headers.push({
      key: 'Content-Security-Policy',
      value: cspDirectives.join('; '),
    });

    return [
      {
        source: '/(.*)',
        headers,
      },
    ];
  },
};

export default nextConfig;

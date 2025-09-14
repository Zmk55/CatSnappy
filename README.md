# CatSnappy 🐱

> Instagram-style social app for cat lovers - built with Next.js 14

CatSnappy is a modern, production-ready social media platform designed specifically for cat enthusiasts. Share your feline friends' cutest moments, discover amazing cat content, and connect with fellow cat lovers from around the world.

## ✨ Features

- **📸 Photo Sharing**: Upload and share your cat's most adorable moments
- **❤️ Social Interactions**: Like, comment, and vote on posts
- **🔍 Discovery**: Search and explore cat content with tags
- **👤 User Profiles**: Create and customize your profile
- **🌙 Dark Mode**: Beautiful dark and light themes
- **📱 Mobile-First**: Responsive design that works on all devices
- **🔒 Secure**: Built-in authentication and authorization
- **⚡ Fast**: Optimized for performance with Next.js 14

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React Server Components
- **UI**: Tailwind CSS, shadcn/ui, Lucide React icons
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Email/Password + Google OAuth)
- **Storage**: S3-compatible storage (AWS S3 in production, MinIO for development)
- **Images**: Next/Image with on-the-fly transforms and blurhash
- **Testing**: Vitest + React Testing Library, Playwright for E2E
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker and Docker Compose
- PostgreSQL (or use Docker)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd catsnappy
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/catsnappy"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# S3 Storage (MinIO for development)
S3_ENDPOINT="http://127.0.0.1:9000"
S3_REGION="us-east-1"
S3_BUCKET="catsnappy"
S3_ACCESS_KEY="minioadmin"
S3_SECRET_KEY="minioadmin"
```

### 3. Start Development Environment

#### Option A: Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL, MinIO, Mailpit)
docker-compose up -d

# Run database migrations
pnpm db:push

# Seed the database with sample data
pnpm db:seed

# Start the development server
pnpm dev
```

#### Option B: Local Development

```bash
# Start PostgreSQL and MinIO manually, then:
pnpm db:push
pnpm db:seed
pnpm dev
```

### 4. Access the Application

- **App**: http://localhost:3000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
- **Mailpit**: http://localhost:8025

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (marketing)/       # Marketing pages (landing, about)
│   ├── (app)/            # Protected app pages
│   │   ├── feed/         # Main feed
│   │   ├── upload/       # Image upload
│   │   ├── profile/      # User profiles
│   │   └── search/       # Search functionality
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── posts/        # Post management
│   │   ├── images/       # Image upload
│   │   ├── likes/        # Like system
│   │   ├── votes/        # Vote system
│   │   ├── comments/     # Comments
│   │   └── profiles/     # User profiles
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── app-navbar.tsx   # Main navigation
│   ├── feed-grid.tsx    # Feed layout
│   ├── post-card.tsx    # Post component
│   └── ...
├── lib/                 # Utility libraries
│   ├── db.ts           # Prisma client
│   ├── auth.ts         # NextAuth configuration
│   ├── s3.ts           # S3/MinIO client
│   ├── zodSchemas.ts   # Validation schemas
│   └── utils.ts        # Utility functions
└── hooks/              # Custom React hooks
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: User accounts with profiles
- **Posts**: Cat photos with captions and metadata
- **Comments**: Comments on posts
- **Likes**: Like system for posts
- **Votes**: Up/down voting system
- **Tags**: Hashtag system for categorization
- **Reports**: Content moderation system

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing
pnpm test             # Run unit tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run E2E tests with UI
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

```bash
# Build production image
docker build -f docker/Dockerfile -t catsnappy .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://user:password@host:5432/catsnappy"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
S3_ENDPOINT="https://your-s3-endpoint.com"
S3_REGION="us-east-1"
S3_BUCKET="your-bucket"
S3_ACCESS_KEY="your-access-key"
S3_SECRET_KEY="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
pnpm test:e2e
```

### Test Coverage

```bash
pnpm test:coverage
```

## 🔒 Security Features

- **Authentication**: Secure user authentication with NextAuth.js
- **Authorization**: Role-based access control
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting middleware
- **Input Validation**: Zod schema validation
- **Secure Headers**: Security headers via Next.js config
- **File Upload Security**: File type and size validation

## 🎨 Customization

### Themes

The app supports light and dark themes. Customize colors in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... other colors
    },
  },
}
```

### Adding New Features

1. Create API routes in `src/app/api/`
2. Add database models in `prisma/schema.prisma`
3. Create UI components in `src/components/`
4. Add pages in `src/app/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commits
- Ensure all checks pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://prisma.io/) - Database toolkit
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**

```bash
# Check if PostgreSQL is running
docker-compose ps

# Reset database
docker-compose down -v
docker-compose up -d
pnpm db:push
```

**MinIO Connection Issues**

```bash
# Check MinIO status
docker-compose logs minio

# Access MinIO console at http://localhost:9001
```

**Build Issues**

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Getting Help

- Check the [Issues](https://github.com/your-username/catsnappy/issues) page
- Create a new issue with detailed information
- Join our community discussions

---

Made with ❤️ for cat lovers everywhere! 🐱

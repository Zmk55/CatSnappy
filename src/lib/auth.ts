import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
// import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        // For demo purposes, we'll skip password verification
        // In production, you'd verify the password hash here
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string

        // Fetch fresh user data from database to get updated profile picture
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              name: true,
              image: true,
            },
          })

          if (user) {
            session.user.name = user.name
            session.user.image = user.image
          }
        } catch (error) {
          console.error('Error fetching user data in session callback:', error)
          // Fallback to token data if database fetch fails
          session.user.name = token.name as string
          session.user.image = token.image as string
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
}

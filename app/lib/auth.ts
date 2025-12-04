import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            studentProfile: true,
            teacherProfile: true,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      // Handle Google OAuth sign-in
      if (account?.provider === 'google') {
        if (!user.email) return false;

        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          // Create new user from Google OAuth
          // Generate username from email
          const baseUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
          let username = baseUsername;
          let counter = 1;

          // Ensure unique username
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              username,
              image: user.image,
              emailVerified: new Date(),
              role: 'STUDENT', // Default role for OAuth users
            },
          });

          // Log registration
          await prisma.auditLog.create({
            data: {
              userId: dbUser.id,
              userEmail: dbUser.email,
              action: 'OAUTH_REGISTER',
              entityType: 'User',
              entityId: dbUser.id,
              details: {
                provider: 'google',
                registeredAt: new Date().toISOString(),
              },
            },
          });
        } else {
          // Update existing user's image and emailVerified
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              image: user.image || dbUser.image,
              emailVerified: dbUser.emailVerified || new Date(),
              lastLogin: new Date(),
            },
          });
        }

        // Attach db user data to the user object
        user.id = dbUser.id;
        (user as any).role = dbUser.role;
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export const { GET, POST } = handlers;

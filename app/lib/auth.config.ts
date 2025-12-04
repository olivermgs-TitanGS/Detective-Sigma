import type { NextAuthConfig } from 'next-auth';

// Edge-compatible auth configuration (no database imports)
export const authConfig: NextAuthConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
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
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      // Protected routes
      if (path.startsWith('/student') || path.startsWith('/teacher') || path.startsWith('/admin')) {
        if (!isLoggedIn) return false;

        const userRole = (auth?.user as any)?.role;

        if (path.startsWith('/admin') && userRole !== 'ADMIN') {
          return Response.redirect(new URL('/login', nextUrl));
        }
        if (path.startsWith('/teacher') && userRole !== 'TEACHER') {
          return Response.redirect(new URL('/login', nextUrl));
        }
        if (path.startsWith('/student') && userRole !== 'STUDENT') {
          return Response.redirect(new URL('/login', nextUrl));
        }
      }

      return true;
    },
  },
  providers: [], // Providers added in auth.ts
};

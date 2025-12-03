import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const token = req.auth;
  const path = req.nextUrl.pathname;

  // Protected routes - redirect to login if not authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Check role-based access
  const userRole = (token as any)?.user?.role;

  if (path.startsWith('/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (path.startsWith('/teacher') && userRole !== 'TEACHER') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (path.startsWith('/student') && userRole !== 'STUDENT') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*'],
};

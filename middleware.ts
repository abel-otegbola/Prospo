import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user")?.value

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/account"]
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // If accessing a protected route without a user cookie, redirect to login
  if (isProtectedRoute && !userCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackURL', request.nextUrl.pathname)
    return Response.redirect(loginUrl)
  }

  // If user is logged in and tries to access auth pages, redirect to account
  if (userCookie && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
    return Response.redirect(new URL('/account', request.url))
  }
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the user session cookie
  const userSession = request.cookies.get("user-session")?.value

  // Check if the user is authenticated
  const isAuthenticated = userSession ? JSON.parse(userSession).isAuthenticated : false

  // Define protected paths that require authentication
  const protectedPaths = ["/patient/dashboard", "/patient/appointments", "/provider/dashboard", "/admin/dashboard"]

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // For debugging
  console.log("Middleware running for path:", request.nextUrl.pathname)
  console.log("Is protected path:", isProtectedPath)
  console.log("Is authenticated:", isAuthenticated)

  // If the path is protected and the user is not authenticated, redirect to login
  if (isProtectedPath && !isAuthenticated) {
    console.log("Redirecting to /auth because user is not authenticated")
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // If the user is authenticated and trying to access auth page, redirect to dashboard
  if (isAuthenticated && request.nextUrl.pathname.startsWith("/auth")) {
    console.log("Redirecting to /patient/dashboard because user is already authenticated")
    return NextResponse.redirect(new URL("/patient/dashboard", request.url))
  }

  console.log("Middleware allowing request to proceed")
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/patient/:path*", "/provider/:path*", "/admin/:path*", "/auth"],
}


import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

const isRootRoute = createRouteMatcher(['/']);

export default clerkMiddleware(async (auth, req) => {
  const authData = await auth();
  
  // Redirect authenticated users from root page to dashboard
  if (isRootRoute(req) && authData.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    if (!authData.userId) {
      // Redirect unauthenticated users to home page
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

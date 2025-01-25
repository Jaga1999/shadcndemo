import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Define routes that are open to everyone (no token required)
  const openPaths = ["/login", "/register"];
  const isOpenPath = openPaths.some((path) => request.nextUrl.pathname.startsWith(path));

  // If the path is open (login or register), allow the request even without a token
  if (isOpenPath) {
    return NextResponse.next();
  }

  // Define protected paths (all routes except login/register)
  const protectedPaths = ["/user", "/dashboard", "/profile"]; // Add more protected paths as needed
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If the path is protected and there's no token, redirect to login
  if (isProtectedPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login"; // Redirect to login if there's no token
    url.search = `redirect=${request.nextUrl.pathname}`; // Save the intended path for redirect after login
    return NextResponse.redirect(url);
  }

  // If a token is present, or if the route is not protected, allow the request to continue
  return NextResponse.next();
}

// Configure the paths to run middleware for
export const config = {
  matcher: ["/user/:path*", "/dashboard", "/profile", "/login", "/register"], // Match the paths for middleware to run
};

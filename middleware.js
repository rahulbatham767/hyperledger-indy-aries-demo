import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("userToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  console.log("Role:", role);
  console.log("Token:", token);

  const url = request.nextUrl;

  // Define protected routes and roles
  const protectedRoutes = [
    { path: "/connection", roles: ["user", "verifier", "admin"] },
    { path: "/request-proof", roles: ["user", "verifier", "admin"] },
    { path: "/credentials", roles: ["user", "verifier", "admin"] },
    { path: "/records", roles: ["user", "verifier", "admin"] },
    { path: "/proof-request", roles: ["verifier"] },
    { path: "/validate-proof", roles: ["verifier"] },
    { path: "/issuing", roles: ["admin", "verifier", "user"] },
    { path: "/message", roles: ["user", "verifier", "admin"] },
  ];

  const requestedPath = url.pathname;

  // Redirect if already logged in and trying to access login/register
  if (
    (token && requestedPath === "/login") ||
    (token && requestedPath === "/register")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Check if the route is protected
  const protectedRoute = protectedRoutes.find((route) =>
    requestedPath.startsWith(route.path)
  );

  // If the route requires protection
  if (protectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!protectedRoute.roles.includes(role)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // If all checks pass, continue the request
  return NextResponse.next();
}

// Apply the middleware only to specific routes
export const config = {
  matcher: [
    "/connection",
    "/request-proof",
    "/credentials",
    "/records",
    "/proof-request",
    "/validate-proof",
    "/issuing",
    "/message",
    "/login",
    "/register",
  ],
};

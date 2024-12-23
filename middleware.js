import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("userToken"); // Replace 'userToken' with your actual cookie name
  const roleCookie = request.cookies.get("userRole"); // Assuming userRole is stored in cookies during login
  const role = roleCookie?.value; // Extract the value from the cookie object
  console.log("Role is:", role);

  const url = request.nextUrl;
  // Protected routes and roles
  const protectedRoutes = [
    { path: "/connection", roles: ["user", "verifier", "admin"] },
    { path: "/credentials", roles: ["user", "verifier", "admin"] },
    { path: "/records", roles: ["user", "verifier", "admin"] },
    { path: "/proof-request", roles: ["verifier"] }, // Only verifiers can access
    { path: "/validate-proof", roles: ["verifier"] }, // Only verifiers can access
    { path: "/issuing", roles: ["admin", "verifier", "user"] },
    { path: "/message", roles: ["user", "verifier", "admin"] },
  ];

  const requestedPath = request.nextUrl.pathname;

  // Check if the route is protected
  const protectedRoute = protectedRoutes.find((route) =>
    requestedPath.startsWith(route.path)
  );

  if (
    (token && url.pathname === "/login") ||
    (token && url.pathname === "/register")
  ) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (protectedRoute) {
    console.log("Protected route is:", protectedRoute);

    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (!protectedRoute.roles.includes(role)) {
      // Redirect to unauthorized page or home if role is not allowed
      const unauthorizedUrl = new URL("/", request.url); // Redirect to home
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

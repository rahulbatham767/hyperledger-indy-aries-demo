import { NextResponse } from "next/server";

export async function GET(req) {
  // Create a response object
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Remove the cookies by setting maxAge to -1 (expired) or using an expired date
  response.cookies.set("userToken", "", { path: "/", maxAge: -1 });
  response.cookies.set("userRole", "", { path: "/", maxAge: -1 });

  // Optionally, you can also clear any session or other data here

  // Return the response to indicate the user is logged out
  return response;
}

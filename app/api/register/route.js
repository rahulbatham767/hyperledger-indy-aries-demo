import { NextResponse } from "next/server";
import crypto from "crypto";

// Mock user data - In a real-world scenario, you'd store this data in a database
const users = [
  { username: "alice", password: "password123", role: "user" },
  { username: "faber", password: "password123", company: "college" },
];

export async function POST(req) {
  const { username, password } = await req.json();

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Username already exists" },
      { status: 400 }
    );
  }

  // Create a new user
  const newUser = { username, password, role: "user" }; // Add additional fields as needed

  // Add the new user to the mock user data
  users.push(newUser);

  // Generate a random token (using crypto)
  const token = crypto.randomBytes(16).toString("hex");

  // Send token in the response header
  const response = NextResponse.json(
    {
      success: true,
      message: "Registration successful!",
      data: newUser,
      token: token,
      register: "true",
    },
    { status: 201 }
  );

  return response;
}

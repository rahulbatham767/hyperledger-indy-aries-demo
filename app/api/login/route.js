import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const { email, password } = await req.json();

  // Log received data
  console.log("Received email:", email);
  console.log("Received password:", password);

  // Mock user data
  const users = [
    {
      email: "virat@gmail.com",
      password: "password123",
      name: "Virat",
      role: "user",
    },
    {
      email: "bombay@gmail.com",
      password: "password123",
      name: "IIT BOMBAY",
      role: "admin",
      company: "college",
    },
    {
      email: "cdac@gmail.com",
      password: "password123",
      name: "CDAC",
      role: "verifier",
      company: "college",
    },
  ];

  console.log("Users array:", users);

  // Check if the email and password match
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  console.log("After finding user:", user);

  if (user) {
    console.log("User is logged in:", user.email);

    // Generate a random token
    const token = crypto.randomBytes(16).toString("hex");

    // Send token in the response header
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful!",
        data: user,
        token: token,
        login: "true",
      },
      { status: 200 }
    );

    response.cookies.set("userToken", token, {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    response.cookies.set("userRole", user.role, {
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } else {
    console.log("Login failed: Invalid username or password");
    return NextResponse.json(
      { success: false, message: "Invalid username or password" },
      { status: 401 }
    );
  }
}

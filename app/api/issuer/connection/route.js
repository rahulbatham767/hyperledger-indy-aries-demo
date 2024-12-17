// pages/api/aries/create-connection.js
import axios from "axios";

export async function GET(req) {
  const { autoAccept, alias } = await req.nextUrl.searchParams;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/connections`, // ACA-Py Agent API URL
      {
        auto_accept: autoAccept, // Whether to auto-accept the connection request
        alias: alias, // Optional: Alias for the connection
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error sending message:", error.message);
    return Response.json(
      {
        error: "Failed to show connection",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

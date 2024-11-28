// pages/api/aries/create-connection.js
import axios from "axios";

export async function GET(req) {
  const { autoAccept, alias } = await req.nextUrl.searchParams;

  try {
    const response = await axios.get(
      `http://10.210.13.86:8001/connections`, // ACA-Py Agent API URL
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
    console.error(error);
    return Response.json(
      { error: "Failed to create connection" },
      { status: 500 }
    );
  }
}

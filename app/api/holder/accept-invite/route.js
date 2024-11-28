// pages/api/aries/accept-invite.js
import axios from "axios";

export async function POST(req) {
  const { connectionId } = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/connections/${connectionId}/accept-invitation`, // ACA-Py Agent API URL
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <YOUR_AUTH_TOKEN>", // If required
        },
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

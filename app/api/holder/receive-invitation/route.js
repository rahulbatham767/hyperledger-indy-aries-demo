// pages/api/aries/accept-invite.js
import axios from "axios";

export async function POST(req) {
  const { invitation } = await req.json();

  console.log(invitation);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/out-of-band/receive-invitation`, // ACA-Py Agent API URL
      invitation,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error sending message:", error.message);
    return Response.json(
      {
        error: "Failed to send the message.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

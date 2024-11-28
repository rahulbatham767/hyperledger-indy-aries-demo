// pages/api/aries/send-message.js
import axios from "axios";

export async function POST(req) {
  const { connectionId, message } = await req.json();

  if (!connectionId || !message) {
    return Response.json(
      { error: "Connection ID and message are required." },
      { status: 400 }
    );
  }

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/connections/${connectionId}/send-message`, // ACA-Py Agent API URL
      { content: message }, // Message content
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json(await response.data); // Send the API response as JSON
  } catch (error) {
    console.error("Error sending message:", error.message);
    return Response.json(
      { error: "Failed to send the message." },
      { status: 500 }
    );
  }
}

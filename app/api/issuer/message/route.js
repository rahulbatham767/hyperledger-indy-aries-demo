// pages/api/aries/send-message.js
import axios from "axios";

export async function POST(req) {
  try {
    // Parse the JSON body
    const { content, param } = await req.json();
    console.log(content);
    // const url = new URL(req.url);
    // const conn_id = url.searchParams.get("conn_id");

    // Validate input
    if (!param || !content) {
      return Response.json(
        { error: "Connection ID and message content are required." },
        { status: 400 }
      );
    }

    // console.log("The connection ID is:", conn_id);
    console.log("Message content:", content);

    // Send the message to the ACA-Py endpoint
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/connections/${param}/send-message`, // ACA-Py Agent API URL
      { content }, // Message content payload
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Message sent successfully:", response.data);

    // Return the API response as JSON
    return Response.json(response.data);
  } catch (error) {
    // Log and return the error
    console.error("Error sending message:", error.message);
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

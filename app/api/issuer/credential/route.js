// pages/api/aries/create-record.js
import axios from "axios";

export async function GET(req) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/credentials` // ACA-Py Agent
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

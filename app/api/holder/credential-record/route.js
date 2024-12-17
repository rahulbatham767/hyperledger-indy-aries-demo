// pages/api/aries/create-record.js
import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url);

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/issue-credential-2.0/records`, // ACA-Py Agent
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
    console.error("Error showing credential record:", error.message);
    return Response.json(
      {
        error: "Failed to showing credential record.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

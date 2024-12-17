// pages/api/aries/accept-credential.js
import axios from "axios";

export async function POST(req) {
  const { holder } = await req.json();
  const cred_ex_id = new URL(req.url).searchParams.get("cred_ex_id");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/issue-credential-2.0/records/${cred_ex_id}/send-request`, // ACA-Py Agent API URL
      holder,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("accept credential " + response);
    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error sending Credential:", error.message);
    return Response.json(
      {
        error: "Failed to Accept Credential.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

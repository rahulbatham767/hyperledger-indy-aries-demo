// ISSUE CREDENTIAL PROPOSAL

// pages/api/aries/issue-credential.js
import axios from "axios";

export async function POST(req) {
  const { issuer } = await req.json();
  const url = new URL(req.url);
  const cred_ex_id = url.searchParams.get("cred_ex_id");
  console.log(issuer);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/issue-credential-2.0/records/${cred_ex_id}/send-offer`, // ACA-Py Agent API URL
      issuer,

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response data:", response.data);

    // Return the response in JSON format
    return Response.json(response.data);
  } catch (error) {
    // Log and return the error
    console.error("Error sending offer:", error.message);
    return Response.json(
      {
        error: "Failed to send the Offer.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

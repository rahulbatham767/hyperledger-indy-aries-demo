// ISSUE CREDENTIAL PROPOSAL

// pages/api/aries/issue-credential.js
import axios from "axios";

export async function POST(req) {
  const cred_ex_id = new URL(req.url).searchParams.get("cred_ex_id");

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/issue-credential-2.0/records/${cred_ex_id}/store`, // ACA-Py Agent API URL

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
    console.error("Error storing Credential", error.message);
    return Response.json(
      {
        error: "Failed to store the Credential.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

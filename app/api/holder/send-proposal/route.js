// ISSUE CREDENTIAL PROPOSAL

// pages/api/aries/issue-credential.js
import { ProposalforCredential } from "@/app/utils/helper";
import axios from "axios";

export async function POST(req) {
  const { formData } = await req.json();
  console.log("issuer of route", formData); // Log formData

  const url = new URL(req.url);
  const cred_ex_id = url.searchParams.get("cred_ex_id");
  console.log("Proposed credential:", formData);

  // Generate payload
  const payload = ProposalforCredential(formData);
  console.log("Payload is", JSON.stringify(payload));

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/issue-credential-2.0/send-proposal`, // ACA-Py Agent API URL

      payload,

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

import { generateCredentialPayload } from "@/app/utils/helper";
import axios from "axios";

export async function POST(req) {
  const { formData } = await req.json();
  console.log("issuer of route", formData); // Log formData

  const url = new URL(req.url);
  const cred_ex_id = url.searchParams.get("cred_ex_id");
  console.log("Issued credential:", formData);

  // Generate payload
  const payload = generateCredentialPayload(formData);
  console.log("Payload is", JSON.stringify(payload));

  try {
    let response;
    if (!cred_ex_id) {
      // Send to the endpoint for issuing credential proposal
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/issue-credential-2.0/send`, // ACA-Py Agent API URL
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data);
    } else {
      // Send to the endpoint for issuing the credential with a given cred_ex_id
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/issue-credential-2.0/records/${cred_ex_id}/issue`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response data:", response.data);
    }

    // Return the response data
    return Response.json(response.data);
  } catch (error) {
    // Log and return the error
    console.error("Error sending credential:", error.message);
    return Response.json(
      {
        error: "Failed to send the credential.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

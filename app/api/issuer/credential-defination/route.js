// pages/api/aries/create-credential-definition.js
import axios from "axios";

export async function POST(req) {
  const { issuer } = await req.json();
  console.log(issuer);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/credential-definitions`, // ACA-Py Agent API URL
      issuer,
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
    console.error("Error Creating Credential Defination:", error.message);
    return Response.json(
      {
        error: "Failed to send the message.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Extract `cred_def_id` from query parameters
    const cred_def_id = new URL(req.url).searchParams.get("cred_def_id");

    if (cred_def_id) {
      // Encode `cred_def_id` to handle special characters correctly
      const encodedCredDefId = encodeURIComponent(cred_def_id);
      console.log("Encoded cred_def_id:", encodedCredDefId);

      // Make the specific API call
      const specificResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/credential-definitions/${encodedCredDefId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Specific Credential Definition:", specificResponse.data);
      return Response.json(specificResponse.data); // Return the specific response
    }

    // If no `cred_def_id`, make the general API call
    const generalResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/credential-definitions/created`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("General Credential Definitions:", generalResponse.data);
    return Response.json(generalResponse.data); // Return the general response
  } catch (error) {
    console.error("Error Fetching Credential Definitions:", error.message);

    // Handle and return error response
    return Response.json(
      {
        error: "Failed to fetch credential definitions.",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}

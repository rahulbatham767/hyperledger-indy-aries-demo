// pages/api/aries/accept-credential.js
import axios from "axios";

export async function POST(req) {
  const { connectionId, credentialRequestId, credentialId } = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/issue-credential/records/${credentialRequestId}/accept`, // ACA-Py Agent API URL
      {
        credential_id: credentialId, // ID of the credential being accepted
        connection_id: connectionId, // The connection ID to associate with
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer <YOUR_AUTH_TOKEN>", // If required
        },
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to accept credential" },
      { status: 500 }
    );
  }
}

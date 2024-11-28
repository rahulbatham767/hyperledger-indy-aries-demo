// pages/api/aries/delete-credential.js
import axios from "axios";

export async function DELETE(req) {
  const { credentialId } = await req.json();

  try {
    const response = await axios.delete(
      `http://10.210.13.86:8001/issue-credential/records/${credentialId}`, // ACA-Py Agent API URL
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
      { error: "Failed to delete credential" },
      { status: 500 }
    );
  }
}

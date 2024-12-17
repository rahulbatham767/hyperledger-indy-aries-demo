// pages/api/aries/delete-credential.js
import axios from "axios";

export async function DELETE(req) {
  const url = new URL(req.url);
  const cred_ex_id = url.searchParams.get("cred_ex_id");

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/issue-credential-2.0/records/${cred_ex_id}`, // ACA-Py Agent API URL
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error Deleting Credential:", error.message);
    return Response.json(
      {
        error: "Failed to Delete Credential.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url);
  const cred_ex_id = url.searchParams.get("cred_ex_id");

  console.log("process endpoint " + process.env.NEXT_PUBLIC_ISSUER_ENDPOINT);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/credentials`
    );
    console.log(response.data);
    return Response.json(
      { invitation_receieved: response.data },
      { status: 200 }
    );
  } catch (error) {
    // Log and return the error
    console.error("Error Accepting Request:", error.message);
    return Response.json(
      {
        error: "Failed to Accept Request.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

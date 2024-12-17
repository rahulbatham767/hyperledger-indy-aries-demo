import axios from "axios";

export async function POST(req) {
  const url = new URL(req.url);
  const conn_id = url.searchParams.get("conn_id");
  // console.log("the connid is " + conn_id);
  // const { conn_id } = req.params;
  console.log("process endpoint " + process.env.NEXT_PUBLIC_HOLDER_ENDPOINT);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/didexchange/${conn_id}/accept-request`
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

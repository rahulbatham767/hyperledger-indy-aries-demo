import axios from "axios";

export async function POST(req) {
  try {
    const { Alias } = await req.json();

    console.log(Alias);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/out-of-band/create-invitation`, // ACA-Py Agent API URL
      {
        alias: Alias,
        handshake_protocols: ["https://didcomm.org/didexchange/1.0"],
      },

      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);
    return Response.json({ invite: response.data }, { status: 200 }); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error Creating  Invitation:", error.message);
    return Response.json(
      {
        error: "Failed to Create  Invitation.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

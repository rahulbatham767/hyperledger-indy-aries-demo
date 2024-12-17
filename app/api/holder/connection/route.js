import axios from "axios";

export async function GET(req) {
  try {
    const url = new URL(req.url); // Parse the request URL
    const conn_id = url.searchParams.get("conn_id"); // Get the `conn_id` from query params

    const endpoint = conn_id
      ? `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/connections/${conn_id}`
      : `${process.env.NEXT_PUBLIC_HOLDER_ENDPOINT}/connections`;

    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(response.data);

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    // Log and return the error
    console.error("Error showing connection:", error.message);

    return Response.json(
      {
        error: "Failed to show connection",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

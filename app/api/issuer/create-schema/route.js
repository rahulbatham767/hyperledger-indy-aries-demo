import axios from "axios";

export async function POST(req) {
  const { data } = await req.json();
  console.log("data is ", data);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/schemas`, // ACA-Py Agent API URL
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);

    return Response.json(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Log and return the error
    console.error("Error Creating Schema:", error.message);
    return Response.json(
      {
        error: "Failed to Create Schema.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const schema_id = url.searchParams.get("schema_id");
    if (!schema_id) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/schemas/created` // ACA-Py Agent API URL
      );
      console.log(response);

      return Response.json(response.data);
    } else {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/schemas/${schema_id}` // ACA-Py Agent API URL
      );

      console.log(response);

      return Response.json(response.data);
    }
  } catch (error) {
    // Log and return the error
    console.error("Error Getting Schema:", error.message);
    return Response.json(
      {
        error: "Failed to Get the  Schema.",
        details: error.response?.data || error.message, // Provide additional details for debugging
      },
      { status: error.response?.status || 500 }
    );
  }
}

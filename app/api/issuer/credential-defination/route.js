// pages/api/aries/create-credential-definition.js
import axios from "axios";

export async function POST(req) {
  const body = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/credential-definitions`, // ACA-Py Agent API URL
      {
        ...body,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create credential definition" },
      { status: 500 }
    );
  }
}

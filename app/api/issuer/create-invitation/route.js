// pages/api/aries/create-invitation.js
import axios from "axios";

export async function POST(req) {
  const body = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/connections/create-invitation`, // ACA-Py Agent API URL
      {
        connection_protocol: "connections",
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
      { error: "Failed to create invitation " + error },
      { status: 500 }
    );
  }
}

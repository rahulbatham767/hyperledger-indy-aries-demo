// pages/api/aries/issue-credential.js
import axios from "axios";

export async function POST(req) {
  const body = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/issue-credential/send`, // ACA-Py Agent API URL
      {
        ...body,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response data:", response.data);

    // Return the response in JSON format
    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to issue credential " + error.message },
      { status: 500 }
    );
  }
}

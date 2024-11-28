// pages/api/aries/get-credential-definition.js
import axios from "axios";

export async function GET(req) {
  const { credDefId } = req.url.split("?")[1]; // Assuming the query parameter is in the URL

  try {
    const response = await axios.get(
      `http://10.210.13.86:8001/credential-definitions/${credDefId}`, // ACA-Py Agent API URL
      {
        headers: {},
      }
    );

    return Response.json(await response.data); // Return the response in JSON format
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to get credential definition" },
      { status: 500 }
    );
  }
}

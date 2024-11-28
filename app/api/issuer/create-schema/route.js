import axios from "axios";

export async function POST(req) {
  const { schemaName, schemaVersion, attributes } = await req.json();

  try {
    const response = await axios.post(
      `http://10.210.13.86:8001/schema`, // ACA-Py Agent API URL
      {
        schema_name: schemaName,
        schema_version: schemaVersion,
        attributes: attributes,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return Response.json(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return Response.json(JSON.stringify({ error: "Failed to create schema" }), {
      status: 500,
    });
  }
}

export async function GET(req, res) {
  return Response.json("Hi");
}
